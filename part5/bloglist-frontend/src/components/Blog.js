import React, { useState } from 'react'


const Blog = ({ blog, user, showNotification, handleLike, handleDelete  }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const handleLikeClick = async () => {
    try {
      await handleLike(blog)
    } catch (error) {
      showNotification('Failed to update blog', 'error')
    }
  }

  const handleDeleteClick = async () => {
    handleDelete(blog.id, blog.title, blog.author)
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
    <div className="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button id = "hide-view" onClick={toggleDetails}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails && (
        <div>
          <span>{blog.url}</span>
          <br />
          <span>likes {blog.likes}
            <button id="like" onClick={handleLikeClick}>like</button>
          </span>
          <br />
          <span>{blog.author}</span>
          <br />
          <span>{blog.user.name}</span>
          <br />
          {blog.user.username === user.username && (
            <span><div style={deleteWrapperStyle}>
              <button id="delete" style={deleteButtonStyle} onClick={handleDeleteClick}>delete</button>
            </div></span>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
