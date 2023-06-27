/* eslint-disable no-undef */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

function Notification({ message, type }) {
  const notificationStyle = {
    background: 'lightgray',
    padding: '10px',
    marginBottom: '10px',
    fontSize: '1.5rem',
    color: type === 'success' ? 'green' : 'red',
    border: type === 'success' ? '2px solid green' : '2px solid red',
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

function LoginForm({
  handleLogin, username, password, setUsername, setPassword,
}) {
  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  )
}

function BlogForm({ addBlog, newBlog, handleInputChange }) {
  return (
    <form onSubmit={addBlog}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={newBlog.title}
          name="title"
          onChange={handleInputChange}
        />
        <br />
      </div>
      <div>
        <label htmlFor="author">Author:</label>
        <input
          type="text"
          id="author"
          value={newBlog.author}
          name="author"
          onChange={handleInputChange}
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
          onChange={handleInputChange}
        />
        <br />
      </div>
      <br />
      <button type="submit">Create</button>
    </form>
  )
}

function App() {
  const [blogs, setBlogs] = useState([])

  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState(null)

  useEffect(() => {
    // eslint-disable-next-line no-shadow
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      showNotification('Login successful', 'success')
    } catch (exception) {
      showNotification('Wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser') // Remove user from local storage
    showNotification('Logged out', 'success')
  }

  const addBlog = (event) => {
    event.preventDefault()

    blogService
      .create(newBlog)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlog({ title: '', author: '', url: '' })
        showNotification(
          `A new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
          'success',
        )
      })
      .catch((error) => {
        showNotification('Failed to create a new blog', 'error')
      })
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setNewBlog((prevBlog) => ({
      ...prevBlog,
      [name]: value,
    }))
  }

  return (
    <div>
      {notification && <Notification message={notification.message} type={notification.type} />}

      {user === null && (
        <div>
          <h2>Log in to application</h2>
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
          />
        </div>
      )}
      {user && (
        <div>
          <h2>blogs</h2>
          <p>
            {user.name}
            {' '}
            logged in
            {' '}
            <button type="button" onClick={handleLogout}>Logout</button>
          </p>
          <br />
          <h2>create new</h2>
          <BlogForm
            addBlog={addBlog}
            newBlog={newBlog}
            handleInputChange={handleInputChange}
          />
          <div>
            {/* Display blogs */}
            {blogs.map((blog) => <Blog key={blog.id} blog={blog} />)}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
