import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

import {
  BrowserRouter as Router,
  Routes, Route, Link
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
      <Link style={padding} to="/add"><button>add book</button></Link>
      </div>
      <Routes>
      <Route path="/authors" element={<Authors setError={notify} />} />
      <Route path="/books" element={<Books />} />
      <Route path="/add" element={<NewBook setError={notify} />} />
      </Routes>
    </div>
    </Router>
  )
}

export default App
