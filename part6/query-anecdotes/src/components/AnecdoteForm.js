import React, { useState} from 'react';
import { useNotificationDispatch } from '../reducers/NotificationContext';


const AnecdoteForm = ({ createAnecdote }) => {
  const [content, setContent] = useState('')
  const { showNotification } = useNotificationDispatch()

  const onCreate = (event) => {
  event.preventDefault()
  if (content.length >= 5) {
    createAnecdote(content)
    setContent('')
    event.target.anecdote.value = ''
  } else {
    showNotification('too short anectdote, must have length 5 or more')
    
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
