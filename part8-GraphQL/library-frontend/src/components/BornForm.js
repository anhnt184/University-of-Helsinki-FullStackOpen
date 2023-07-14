    import { useState , useEffect } from 'react'
    import { useMutation } from '@apollo/client'

    import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

    const BornForm = ({ setError }) => {
    const [name, setName] = useState('')
    const [born, setBorn] = useState('')

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

    const submit = async (event) => {
        event.preventDefault()
        const bornInt = parseInt(born, 10)
        editAuthor({ variables: { name, born: bornInt  } })

        setName('')
        setBorn('')
    }

    return (
        <div>
        <h2>Set birthyear</h2>

        <form onSubmit={submit}>
            <div>
            name <input
                value={name}
                onChange={({ target }) => setName(target.value)}
            />
            </div>
            <div>
            phone <input
                value={born}
                onChange={({ target }) => setBorn(target.value)}
            />
            </div>
            <button type='submit'>update author</button>
        </form>
        </div>
    )
    }

    export default BornForm