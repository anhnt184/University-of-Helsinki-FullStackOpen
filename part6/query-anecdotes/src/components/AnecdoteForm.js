import React, { useState } from 'react'

const AnecdoteForm = ({ createAnecdote, showNotification }) => {
  const [content, setContent] = useState('')
const onCreate = (event) => {
  event.preventDefault()
  if (content.length >= 5) {
    createAnecdote(content)
    setContent('')
    event.target.anecdote.value = ''
  } else {
    showNotification('The anecdote must be at least 5 characters long')
  }
  
}
 
  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' onChange={(e) => setContent(e.target.value)} />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
