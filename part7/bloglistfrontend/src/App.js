import React, { useEffect, useRef, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { setNotificationWithTimeout } from './reducers/notificationReducer'

import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import userService from './services/users'

import { initializeBloglist } from './reducers/bloglistReducer'
import { setUser, clearUser } from './reducers/userReducer'
import { Table, Button, Nav, Navbar } from 'react-bootstrap'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
  useNavigate,

} from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  navigate('/blogs')
}

const BlogsView = ({ user, blogFormRef }) => (
  <div>
    <h2>blogs</h2>
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm user={user}/>
    </Togglable>

    <div>
      {/* Display blogs */}
      <Blog />
    </div>
  </div>
)

const UsersView = () => {
  const [users, setUsers] = useState([])

  const blogs = useSelector((state) =>
    state.bloglist.slice().sort((a, b) => b.likes - a.likes)
  )
  useEffect(() => {
    const fetchUsers = async () => {
      const users = await userService.getAllUsers()
      const formattedUsers = users.map((user) => {
        const blogCount = blogs.filter((blog) => blog.user.id === user.id).length
        return {
          id: user.id,
          name: user.name,
          blogCount: blogCount,
        }
      })
      setUsers(formattedUsers)
    }
    fetchUsers()
  }, [blogs])

  return (
    <div>
      <h2>Users</h2>
      <Table striped>
        <thead>
          <tr>
            <th>Username</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogCount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

const UserView = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await userService.getUser(id)
        setUser(user)
      } catch (error) {
        console.log(error)
      }
    }

    fetchUser()
  }, [id])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2>User</h2>
      <h1>{user.name}</h1>
      <h3>Added blogs:</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

const BlogView = () => {
  const { id } = useParams()
  const bloglist = useSelector((state) => state.bloglist)
  const blog = bloglist.find((blog) => blog.id === id)

  if (!blog) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>{blog.title} {blog.author}</h1>
      <div>
        <a href={blog.url}>
          {blog.url}
        </a>
        <p>{blog.likes} likes</p>
        <p>added by {blog.user.name}</p>
      </div>
    </div>
  )
}


const App = () => {
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

  const padding = {
    padding: 5
  }

  return (

    <div className="container">
      <Notification />
      <Router>
        {user === null && <Togglable buttonLabel="log in">
          <div>
            <h2>Log in to application</h2>
            <LoginForm />
          </div>
        </Togglable>
        }
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="blog-auto">
              <div>
                <Nav.Link href="#" as="span">
                  <Link style={padding} to="/blogs">blogs</Link>
                </Nav.Link>
                <Nav.Link href="#" as="span">
                  <Link style={padding} to="/users">users  </Link>
                  {user ? (
                    <>
                      <em>{user.name} logged in   </em>
                      <Button id="logout" onClick={handleLogout} variant="primary" type="submit">
              Logout</Button>
                    </>
                  ) : (
                    <Link style={padding} to="/login">login</Link>
                  )}
                </Nav.Link>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes>
          <Route path="/users/:id" element={<UserView />} />
          <Route path="/blogs" element={user ? <BlogsView user={user} blogFormRef={blogFormRef} /> : <Navigate replace to="/login" />} />
          <Route path="/blogs/:id" element={<BlogView />} />
          <Route path="/users" element={user ? <UsersView /> : <Navigate replace to="/login" />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<Home />} />
        </Routes>

      </Router>
      <div>
        <br />
        <em>Bloglist app, Tuan Anh, Nguyen 2023</em>
      </div>
    </div>
  )
}

export default App
