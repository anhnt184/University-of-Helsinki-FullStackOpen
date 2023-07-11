import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { likeBlog, removeBlog } from '../reducers/bloglistReducer'
import blogService from '../services/blogs'

import { setNotificationWithTimeout } from '../reducers/notificationReducer'



const Blog = () => {
  const bloglist = useSelector((state) =>
    state.bloglist.slice().sort((a, b) => b.likes - a.likes)
  )
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const [showDetails, setShowDetails] = useState({})

  const toggleDetails = (blogId) => {
    setShowDetails((prevState) => ({
      ...prevState,
      [blogId]: !prevState[blogId]
    }))
  }

  const handleLikeClick = async (blog) => {
    try {
      const newBlog = await blogService.updateLike(blog)
      dispatch(likeBlog(newBlog.id))
      dispatch(setNotificationWithTimeout(`You liked '${blog.title}'`, 'success', 5))
    } catch (error) {
      dispatch(setNotificationWithTimeout('Failed to update blog', 'error', 5))
    }
  }

  const handleDeleteClick = async (blogId) => {
    try {
      await blogService.remove(blogId)
      dispatch(removeBlog(blogId))
      dispatch(setNotificationWithTimeout('Blog deleted successfully', 'success', 5))
    } catch (error) {
      dispatch(setNotificationWithTimeout('Failed to delete blog', 'error', 5))
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const deleteButtonStyle = {
    backgroundColor: 'darkgreen',
    color: 'black',
    border: 'none',
    borderRadius: '3px',
    padding: '3.5px 12px',
    cursor: 'pointer',
  }

  const deleteWrapperStyle = {
    margin: '5px 0',
  }

  return (
    <div>
      {bloglist.map((blog) => (
        <div key={blog.id} className="blog" style={blogStyle}>
          <div>
            {blog.title} {blog.author}
            <button id="hide-view" onClick={() => toggleDetails(blog.id)}>
              {showDetails[blog.id] ? 'hide' : 'view'}
            </button>
          </div>
          {showDetails[blog.id] && (
            <div>
              <span>{blog.url}</span>
              <br />
              <span>
                likes {blog.likes}
                <button id="like" onClick={() => handleLikeClick(blog)} >
                  like
                </button>
              </span>
              <br />
              <span>{blog.author}</span>
              <br />
              <span>{blog.user.name}</span>
              <br />
              {/* Delete button */}
              {blog.user.username === user.username && (
                <span>
                  <div style={deleteWrapperStyle}>
                    <button
                      id="delete"
                      style={deleteButtonStyle}
                      onClick={() =>
                        handleDeleteClick(blog.id)
                      }
                    >
                      delete
                    </button>
                  </div>
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Blog

