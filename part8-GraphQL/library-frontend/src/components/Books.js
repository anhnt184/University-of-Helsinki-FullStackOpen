import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from "../queries"

const Books = (props) => {
    const [selectedGenre, setSelectedGenre] = useState('all')

    const { loading, data, refetch } = useQuery(ALL_BOOKS)

    useEffect(() => {
        refetch({ genre: selectedGenre === 'all' ? null : selectedGenre })
    }, [selectedGenre, refetch])


  if (loading)  {
    return <div>loading...</div>
  }

  const books = data.allBooks

  // Get a unique list of genres from the book data
  const genres = [...new Set(books.flatMap((book) => book.genres))]

  const handleGenreChange = (genre) => {
      setSelectedGenre(genre);
  }
    const filteredBooks = books

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {['all', ...genres].map((genre) => (
          <button
            key={genre}
            style={{ marginLeft: '5px' }}
            onClick={() => handleGenreChange(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Books
