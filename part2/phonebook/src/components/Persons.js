import React from 'react';
import personService from '../services/PersonServices';

const Persons = ({ filteredPersons, setPersons, persons}) => {
  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      });
    }
  };

  return (
    <div>
      {filteredPersons.map((person) => (
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={() => deletePerson(person.id, person.name)}>
            delete
          </button>
        </p>
      ))}
    </div>
  );
};

  const PersonForm = ({ addName, newName, newNumber, handleNameChange, handleNumberChange}) => {
    return (
      <>
        <form onSubmit = {addName}>
        <div>name: <input value = {newName} onChange={handleNameChange}/></div>
        <div>number: <input value = {newNumber} onChange = {handleNumberChange}/></div>
        <div><button type="submit">add</button></div>
        </form>
        </>
    )
  }
  
  export { Persons, PersonForm };