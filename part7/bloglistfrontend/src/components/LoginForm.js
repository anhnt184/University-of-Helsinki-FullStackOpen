import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'
import { setUser } from '../reducers/userReducer'
import loginService from '../services/login'
import { Form, Button } from 'react-bootstrap'

function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)

  useEffect(() => {
    if (user) {
      navigate('/blogs')
    }
  }, [user, navigate])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
      dispatch(setNotificationWithTimeout('Login successful', 'success', 5))
    } catch (exception) {
      dispatch(setNotificationWithTimeout('Wrong username or password', 'error', 5))
    }
  }
  return (
    <Form onSubmit={handleLogin}>
      <Form.Group>
        <Form.Label>username:</Form.Label>
        <Form.Control
          id='username'
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />

        <Form.Label>password:</Form.Label>
        <Form.Control
          id='password'
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <Button id="login-button" variant="primary" type="submit">
            login
        </Button>
      </Form.Group>
    </Form>
  )
}

export default LoginForm
