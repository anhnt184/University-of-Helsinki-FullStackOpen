    import { useState , useEffect } from 'react'
    import { useMutation, useQuery } from '@apollo/client'

    import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'
    import Select from 'react-select'

    const BornForm = ({ setError }) => {
    const [name, setName] = useState('')
    const [born, setBorn] = useState('')
    const [selectedAuthor, setSelectedAuthor] = useState(null)
    const { loading, data } = useQuery(ALL_AUTHORS)

    const [ editAuthor, result ] = useMutation(EDIT_AUTHOR, {
        refetchQueries: [ { query: ALL_AUTHORS } ],
        onError: (error) => {
          const messages = error.graphQLErrors[0].message
          setError(messages)
        }   
      })

    useEffect(() => {
        if (result.data && result.data.editAuthor === null) {
        setError('author not found')
        }
    }, [result.data]) // eslint-disable-line 

    const authors = data ? data.allAuthors : []

    const handleAuthorChange = (selectedOption) => {
        setSelectedAuthor(selectedOption);
        setName(selectedOption.value);
      }

    const submit = async (event) => {
        event.preventDefault()
        const bornInt = parseInt(born, 10)
        editAuthor({ variables: { name, born: bornInt  } })

        setName('')
        setBorn('')
    }

    if (loading) {
        return <div>loading...</div>;
      }

    return (
        <div>
      <h2>Set birthyear</h2>

      <form onSubmit={submit}>
        <div>
          <Select
            value={selectedAuthor}
            onChange={handleAuthorChange}
            options={authors.map((author) => ({
              value: author.name,
              label: author.name,
            }))}
            placeholder="Select author"
          />
        </div>
        {selectedAuthor && (
          <div>
            <label>
              born
              <input
                type="number"
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </label>
          </div>
        )}
        <button type="submit" disabled={!selectedAuthor}>
          update author
        </button>
      </form>
    </div>
  )
    }

    export default BornForm