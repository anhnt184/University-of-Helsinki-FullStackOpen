import { useState } from 'react'

import { useMutation } from '@apollo/client'

import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'

const NewBook = ({ setError }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ createBook ] = useMutation(CREATE_BOOK, {
    // refetchQueries: [ { query: ALL_BOOKS } ],
    onError: (error) => {
      // const errors = error.graphQLErrors[0].extensions.error.errors
      // const messages = Object.values(errors).map(e => e.message).join('\n')
      // const messages = error.graphQLErrors[0].message

      // console.log('Error', error)
      let errorMessage = 'An error occurred';
    if (
      error.graphQLErrors &&
      error.graphQLErrors.length > 0 &&
      error.graphQLErrors[0].extensions.error.errors
    ) {
      const errors = error.graphQLErrors[0].extensions.error.errors;
      errorMessage = Object.values(errors)
        .map((e) => e.message)
        .join('\n');
    } 
      setError(errorMessage)  
    },
    update: (cache, response) => {
      const allBooksData = cache.readQuery({ query: ALL_BOOKS })
      // console.log('allBooksData: ', allBooksData)
      // Update cache for books
      if (allBooksData) {
      cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(response.data.addBook),
        }
      })
    }

    const allAuthorsData = cache.readQuery({ query: ALL_AUTHORS })
      // Update cache for authors
      const authorName = response.data.addBook.author.name
      // console.log('authorName: ', authorName)
      if (allAuthorsData) {
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        // If the author is already in the cache, update their bookCount
        if (allAuthors.some((author) => author.name === authorName)) {
          return {
            allAuthors: allAuthors.map((author) =>
              author.name === authorName
                ? { ...author, bookCount: author.bookCount + 1, born: null}
                : author
            ),
          }
        }
        // If the author is not in the cache, add them with bookCount = 1
        return {
          allAuthors: [...allAuthors, { name: authorName, bookCount: 1 }],
        }
      })
    }
    },
  })

  const submit = async (event) => {
    event.preventDefault()
    const publishedInt = parseInt(published, 10)
    createBook({  variables: { title, author, published: publishedInt, genres } })
    
    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook