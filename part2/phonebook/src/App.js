import { useState, useEffect, useMemo } from 'react'
import { Persons, PersonForm, Notification } from './components/Persons'
import Filter from './components/Filter'
import personService from './services/PersonServices'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [notificationType, setNotificationType] = useState('')

  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    // Fetch initial persons from the server
    personService.getAll().then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const updatePersons = () => {
    // Fetch updated persons from the server
    personService.getAll().then((updatedPersons) => {
      setPersons(updatedPersons);
    });
  };

  const addName = (event) => {
    event.preventDefault()
    //Check if name already exists in phonebook
    const nameExist = persons.some((person) => person.name === newName)
    const strAlert = `${newName} is already added to phonebook, replace the old number with a new one?`

    if (nameExist) {
      if (window.confirm(strAlert)) {
        const nameOfPerson = persons.find((person) => person.name === newName)
        const changedPerson = { ...nameOfPerson, number: newNumber }
        personService
          .update(nameOfPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(prevPersons =>
              prevPersons.map(person =>
                person.id !== changedPerson.id ? person : changedPerson
              )
            )
            updatePersons()
            setNewName('')
            setNewNumber('')
            setNotificationType('notification')
            setNotificationMessage(
              `${changedPerson.name} number is changed`
            )
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          })
          .catch(error => {
            setNotificationType('error')
            setNotificationMessage(error.response.data.error)
            setTimeout(() => {
              setNotificationMessage(null)
              updatePersons()
              setNewName('')
              setNewNumber('')
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
          updatePersons()
          setNotificationType('notification')
          setNotificationMessage(
            `Added ${nameObject.name}`
          )
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setNotificationType('error')
          setNotificationMessage(error.response.data.error)
          setTimeout(() => {
            setNotificationMessage(null)
            setNewName('')
            setNewNumber('')
          }, 5000)

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

  const filteredPersons = useMemo(() => {
    return persons.filter((person) => {
      return person.name.toLowerCase().includes(searchKeyword.toLowerCase())
    }
    )
  }, [persons, searchKeyword])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} notificationType={notificationType} />
      <Filter searchKeyword={searchKeyword} handleSearchInputChange={handleSearchInputChange} />
      <h3>Add a new</h3>
      <PersonForm addName={addName} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons
        filteredPersons={filteredPersons}
        setPersons={setPersons}
        persons={persons}
        setNotificationMessage={setNotificationMessage}
        notificationMessage={notificationMessage}
        setNotificationType={setNotificationType}
        notificationType={notificationType} />
    </div>
  )
}

export default App