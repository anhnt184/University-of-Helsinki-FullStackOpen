import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog(newBlog)
    setNewBlog({ title: '', author: '', url: '' })
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="title">title: </label>
          <input
            type="text"
            id="title"
            value={newBlog.title}
            name="title"
            onChange={(event) =>
              setNewBlog({ ...newBlog, title: event.target.value })}
          />
          <br />
        </div>
        <div>
          <label htmlFor="author">author: </label>
          <input
            type="text"
            id="author"
            value={newBlog.author}
            name="author"
            onChange={(event) =>
              setNewBlog({ ...newBlog, author: event.target.value })
            }
          />
          <br />
        </div>
        <div>
          <label htmlFor="url">URL:</label>
          <input
            type="text"
            id="url"
            value={newBlog.url}
            name="url"
            onChange={(event) =>
              setNewBlog({ ...newBlog, url: event.target.value })
            }
          />
          <br />
        </div>
        <br />
        <button type="submit">create new blog</button>
      </form>
    </>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}


export default BlogForm
