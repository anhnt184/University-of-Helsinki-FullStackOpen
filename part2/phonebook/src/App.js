import { useState, useEffect } from 'react'
import axios from 'axios'
import { Persons, PersonForm, Notification } from './components/Persons'
import Filter from './components/Filter'

import personService from './services/PersonServices'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')

  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
    
      },[])
  
  const addName = (event) => {
    event.preventDefault()
    //Check if name already exists in phonebook
    const nameExist = persons.some((person) => person.name === newName)
    const strAlert = `${newName} is already added to phonebook, replace the old number with a new one?`

    if (nameExist) {
      if (window.confirm(strAlert)) {
        const nameOfPerson = persons.find(n => n.name === newName)
        const changedPerson = { ...nameOfPerson, number: newNumber }
        personService
        .update(nameOfPerson.id, changedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person => person.id !== changedPerson.id ? person : returnedPerson))
        setNewName('')
        setNewNumber('')
        setNotificationMessage(
          `${changedPerson.name} number is changed` 
        )
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      })
      }
    } else {
      const nameObject = {
        name: newName,
        number: newNumber,
    }
    personService
      .create(nameObject)
      .then(returnPerson => {
        setPersons(persons.concat(returnPerson))
        setNotificationMessage(
          `Added ${nameObject.name}`
        )
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
        setNewName('')
        setNewNumber('')
      })
      
    }
    
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleSearchInputChange = (event) => {
    setSearchKeyword(event.target.value)
  }

  const filteredPersons = persons.filter((person) => 
  person.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Filter searchKeyword = {searchKeyword} handleSearchInputChange = {handleSearchInputChange} />
      <h3>Add a new</h3>
      <PersonForm  addName = {addName} newName = {newName} newNumber = {newNumber} handleNameChange = {handleNameChange} handleNumberChange = {handleNumberChange} />
      <h3>Numbers</h3>
      <Persons
        filteredPersons = {filteredPersons}
        setPersons={setPersons}
        persons={persons}
        setNotificationMessage = {setNotificationMessage}
        notificationMessage = {notificationMessage} />
      </div>
  )
}

export default App