import React from 'react';
import { useDispatch } from 'react-redux';
import { addAnecdote } from '../reducers/anecdoteReducer'

import anecdoteService from '../services/anecdotes'

import { setNotification, removeNotification } from '../reducers/notificationReducer';
const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addNewAnecdote = async (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = ''
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(addAnecdote(newAnecdote))
    // console.log('newAnecdote: ', newAnecdote)
    // console.log('content: ', content)

    dispatch(setNotification(`You created '${content}'`))
        setTimeout(() => {
          dispatch(removeNotification())
        }, 5000)
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addNewAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
