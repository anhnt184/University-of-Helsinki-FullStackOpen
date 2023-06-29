import PropTypes from 'prop-types'
import React, { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlogs, user, showNotification }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const handleLike = async () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    await blogService.update(blog.id, updatedBlog)
    updateBlogs()
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(blog.id)
      updateBlogs()
      showNotification(
        `Blog ${blog.title} deleted successfully`,
        'success',
      )

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
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails && (
        <div>
          {blog.url}
          <br />
          likes {blog.likes}
          <button onClick={handleLike}>like</button>
          <br />
          {blog.author}
          <br />
          {blog.user.name}
          <br />
          {blog.user.username === user.username && (
            <div style={deleteWrapperStyle}>
              <button style={deleteButtonStyle} onClick={handleDelete}>delete</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlogs: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  showNotification: PropTypes.func.isRequired
}

export default Blog
