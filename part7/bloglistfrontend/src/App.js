import React, { useEffect, useRef } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { setNotificationWithTimeout } from './reducers/notificationReducer'

import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import blogService from './services/blogs'

import { initializeBloglist } from './reducers/bloglistReducer'
import { setUser, clearUser } from './reducers/userReducer'


function App() {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBloglist())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser') // Remove user from local storage

    dispatch(clearUser())
    dispatch(setNotificationWithTimeout('Logged out', 'success', 5))
  }

  return (
    <div>
      <Notification />
      {user === null && <Togglable buttonLabel="log in">
        <div>
          <h2>Log in to application</h2>
          <LoginForm />
        </div>
      </Togglable>
      }
      {user && (
        <div>
          <h2>blogs</h2>
          <p>
            {user.name} {' '} logged in{' '}
            <button id="logout" type="button" onClick={handleLogout}>Logout</button>
          </p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm user={user}/>
          </Togglable>

          <div>
            {/* Display blogs */}
            <Blog />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
