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
        <button onClick={toggleDetails}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails && (
        <div>
          {blog.url}
          <br />
          likes {blog.likes}
          <button onClick={handleLikeClick}>like</button>
          <br />
          {blog.author}
          <br />
          {blog.user.name}
          <br />
          {blog.user.username === user.username && (
            <div style={deleteWrapperStyle}>
              <button style={deleteButtonStyle} onClick={handleDeleteClick}>delete</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
