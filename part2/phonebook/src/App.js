import { useState, useEffect } from 'react'
import axios from 'axios'
import { Persons, PersonForm } from './components/Persons'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }

  )

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