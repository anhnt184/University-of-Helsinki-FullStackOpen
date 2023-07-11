import { useState } from 'react'

import { useDispatch } from 'react-redux'
import { addBloglist } from '../reducers/bloglistReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'
import { Form, Button } from 'react-bootstrap'

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
      <Form onSubmit={addBlog}>
        <Form.Group>
          <Form.Label>title:</Form.Label>
          <Form.Control
            type="text"
            id="title"
            value={newBlog.title}
            name="title"
            onChange={(event) =>
              setNewBlog({ ...newBlog, title: event.target.value })}
          />
          <Form.Label>author:</Form.Label>
          <Form.Control
            type="text"
            id="author"
            value={newBlog.author}
            name="author"
            onChange={(event) =>
              setNewBlog({ ...newBlog, author: event.target.value })
            }
          />
          <Form.Label>URL:</Form.Label>
          <Form.Control
            type="text"
            id="url"
            value={newBlog.url}
            name="url"
            onChange={(event) =>
              setNewBlog({ ...newBlog, url: event.target.value })
            }
          />
          <br />
          <Button id="createblog" variant="primary" type="submit">
          create new blog
          </Button>
        </Form.Group>
      </Form>
      <br />
    </>
  )
}

export default BlogForm
