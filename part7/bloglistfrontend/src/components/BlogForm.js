import { useState } from 'react'

import { useDispatch } from 'react-redux'
import { addBloglist } from '../reducers/bloglistReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const BlogForm = (props) => {
  const dispatch = useDispatch()
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const addBlog = (event) => {
    event.preventDefault()
    dispatch(addBloglist(newBlog, props.user))
    dispatch(setNotificationWithTimeout('Blog created successfully', 'success', 5))

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
        <button id="createblog" type="submit">create new blog</button>
      </form>
    </>
  )
}

export default BlogForm
