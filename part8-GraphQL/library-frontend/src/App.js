import { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Logout from './components/Logout'
import Recommendations from './components/Recommendations'

import { useSubscription, useApolloClient } from '@apollo/client'
import { ALL_BOOKS, BOOK_ADDED } from './queries'


import {Routes, Route, Link} from 'react-router-dom'


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

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    const seen = new Set();
    const uniqueItems = [];

    for (const item of a) {
      const k = item.name;
      if (!seen.has(k)) {
        seen.add(k);
        uniqueItems.push(item);
      }
    }

    return uniqueItems;
  };

   // Check if addedBook is valid
  if (!addedBook || !addedBook.id) {
    return;
  }

  // Read the existing allBooks data from the cache
  const existingData = cache.readQuery(query)
  if (existingData && existingData.allBooks) {
  cache.updateQuery(query, ({ allBooks }) => {
    // console.log('allBooks> ', allBooks);

    // Handle the case where allBooks is null
    if (allBooks === null) {
      return {
        allBooks: [addedBook],
      };
    }

    return {
      data: {
        allBooks: uniqByName(allBooks.concat(addedBook)),
      },
    };
  });
}
}

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('libapp-user-token')
    if (token) {
      setToken(token)
      navigate('/authors')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setToken])

  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data}) => {
      const addedBook = data.data.bookAdded
      // console.log('addedBook: ', addedBook)
     if (data.data.bookAdded) {
      const { title } = data.data.bookAdded
      window.alert(`New book added: ${title}`);
    }
    updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    }
  })


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
   )
}

export default App
