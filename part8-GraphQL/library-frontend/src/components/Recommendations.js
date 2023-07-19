import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from "../queries"

const Recommendations = () => {
  const meResult = useQuery(ME)
  const booksResult = useQuery(ALL_BOOKS)

  if (meResult.loading || booksResult.loading) {
    return <div>Loading...</div>
  }

  const user = meResult.data.me
  const books = booksResult.data.allBooks

  const favoriteGenre = user.favoriteGenre

  const filteredBooks = books.filter(book => book.genres.includes(favoriteGenre))

  return (
    <div>
      <h2>Recommendations</h2>
      <p>Books in your favorite genre: <strong> {favoriteGenre} </strong></p>
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {filteredBooks.map(book => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
