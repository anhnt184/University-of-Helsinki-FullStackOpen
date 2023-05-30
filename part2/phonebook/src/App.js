import { useState } from 'react'
import Person from './components/Person'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleSearchInputChange = (event) => {
    setSearchKeyword(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()
    //Check if name already exists in phonebook
    const nameExist = persons.some((person) => person.name === newName)
    const strAlert = `${newName} is already added to phonebook`

    if (nameExist) {
      alert(strAlert);
    } else {
      const nameObject = {
        name: newName,
        number: newNumber,
        id: persons.length+1
      }
      setPersons(persons.concat(nameObject))
      setNewName('')
      setNewNumber('')
    }
    
  }

  const filteredPersons = persons.filter((person) => 
  person.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
        <div>
          name: <input value = {searchKeyword} onChange={handleSearchInputChange}/>
        </div>
      <h2>add a new</h2>
      <form onSubmit = {addName}>
        <div>
          name: <input value = {newName} onChange={handleNameChange}/>
        </div>
        <div>number: <input value = {newNumber} onChange = {handleNumberChange}/></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
          {filteredPersons.map((person, index) =>
          <Person key = {index} person = {person}/>
          )}
      </div>
    </div>
  )
}

export default App