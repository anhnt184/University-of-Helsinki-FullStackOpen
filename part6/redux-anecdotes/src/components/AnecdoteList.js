import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { voteAnecdote } from '../reducers/anecdoteReducer'
import anecdoteService from '../services/anecdotes'

import { setNotification, removeNotification } from '../reducers/notificationReducer'


const AnecdoteList = () => {
  const anecdotes = useSelector((state) =>
    state.anecdotes.filter(anecdote =>
      anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
    ).sort((a, b) => b.votes - a.votes)
  )
  const dispatch = useDispatch();

  const vote = async (anecdote) => {
    // console.log('vote', id);
    // const newAnecdote = await anecdoteService.updateVote(a)
    // // dispatch(addAnecdote(newAnecdote))

    // dispatch(voteAnecdote(id))
    const newAnecdote = await anecdoteService.updateVote(anecdote);
    dispatch(voteAnecdote(newAnecdote.id))
    dispatch(setNotification(`You voted '${anecdote.content}'`));
          setTimeout(() => {
            dispatch(removeNotification());
          }, 5000)
  };

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
