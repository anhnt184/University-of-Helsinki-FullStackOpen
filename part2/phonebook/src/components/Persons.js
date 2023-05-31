const Persons = ({filteredPersons}) => {
    return (
    <div>
          {filteredPersons.map((person) =>
          <p key={person.id}>{person.name}    {person.number}</p>
          )}
      </div>
    )
  }

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