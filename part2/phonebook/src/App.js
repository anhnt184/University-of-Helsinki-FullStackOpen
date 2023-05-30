import { useState } from 'react'
import { Persons, PersonForm } from './components/Persons'
import Filter from './components/Filter'

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
      <Filter searchKeyword = {searchKeyword} handleSearchInputChange = {handleSearchInputChange} />
      <h3>Add a new</h3>
      <PersonForm  addName = {addName} newName = {newName} newNumber = {newNumber} handleNameChange = {handleNameChange} handleNumberChange = {handleNumberChange} />
      <h3>Numbers</h3>
      <Persons filteredPersons = {filteredPersons}/>
      </div>
  )
}

export default App