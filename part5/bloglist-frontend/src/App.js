import React, { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

function App() {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      // Sort blog posts by the number of likes
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    })
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

  const blogFormRef = useRef()

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

  const addBlog = async  (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)

      blogFormRef.current.toggleVisibility()
      showNotification(
        `A new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        'success',
      )
    } catch(error) {
      showNotification('Failed to create a new blog', 'error')
    }
  }

  const updateBlogs = async () => {
    try {
      const updatedBlogs = await blogService.getAll()
      updatedBlogs.sort((a, b) => b.likes - a.likes)
      setBlogs(updatedBlogs)
    } catch (error) {
      showNotification('Failed to update blogs', 'error')
    }
  }


  return (
    <div>
      {notification && <Notification message={notification.message} type={notification.type} />}

      {user === null && <Togglable buttonLabel="log in">
        <div>
          <h2>Log in to application</h2>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </div>
      </Togglable>
      }
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
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>

          <div>
            {/* Display blogs */}
            {blogs.map((blog) => <Blog key={blog.id} blog={blog}  updateBlogs={updateBlogs} user={user} showNotification = {showNotification}/>)}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
