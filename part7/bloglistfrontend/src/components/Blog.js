import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { likeBlog, removeBlog } from '../reducers/bloglistReducer'
import blogService from '../services/blogs'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

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
  return (
    <div>
      {bloglist.map((blog) => (
        <div key={blog.id} className="blog" style={blogStyle}>
          <div> <Link to={`/blogs/${blog.id}`}>
            {blog.title} {blog.author}
          </Link>
          <Button id="hide-view" onClick={() => toggleDetails(blog.id)} variant="primary" type="submit">
            {showDetails[blog.id] ? 'hide' : 'view'}
          </Button>
          </div>
          {showDetails[blog.id] && (
            <div>
              <span>{blog.url}</span>
              <br />
              <span>
                likes {blog.likes}
                <Button id="like" onClick={() => handleLikeClick(blog)} variant="primary" type="submit">
                like
                </Button>
              </span>
              <br />
              <span>{blog.author}</span>
              <br />
              <span>{blog.user.name}</span>
              <br />
              {/* Delete button */}
              {blog.user.username === user.username && (
                <Button id="delete"
                  onClick={() => handleDeleteClick(blog.id)
                  } variant="primary" type="submit">
                    delete
                </Button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Blog

