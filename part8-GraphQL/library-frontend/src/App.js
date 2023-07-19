import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Logout from './components/Logout'
import Recommendations from './components/Recommendations'


import {
  BrowserRouter as Router,
  Routes, Route, Link, useNavigate
} from 'react-router-dom'


const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null
  }
  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const padding = {
    padding: 5
  }

  return (
    <Router>
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
      <Link style={padding} to="/authors"><button>authors</button></Link>
      <Link style={padding} to="/books"><button>books</button></Link>
      {token ? (
        <>
          <Link style={padding} to="/add">
            <button>add book</button>
          </Link>
          <Link style={padding} to="/recommendations">
                <button>recommendations</button>
          </Link>
          <Link style={padding} to="/logout">
            <button>logout</button>
          </Link>
        </>
      ) : (
        <Link style={padding} to="/login">
          <button>login</button>
        </Link>
      )}
      </div>
      <Routes>
      <Route path="/authors" element={<Authors setError={notify} />} />
      <Route path="/" element={<Authors setError={notify} />} />
      <Route path="/books" element={<Books />} />
      {token ? (
        <>
          <Route path="/add" element={<NewBook setError={notify} />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/logout" element={<Logout setToken={setToken} />} />
        </>
      ) : (
        <Route
          path="/login"
          element={<LoginForm setError={notify} setToken={setToken} />}
        />
      )}        
      </Routes>
    </div>
    </Router>
  )
}

export default App
