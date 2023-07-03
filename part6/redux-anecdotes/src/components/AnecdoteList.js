import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, removeNotification } from '../reducers/notificationReducer'


const AnecdoteList = () => {
  const anecdotes = useSelector((state) =>
    state.anecdotes.filter(anecdote =>
      anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
    ).sort((a, b) => b.votes - a.votes)
  )
  const dispatch = useDispatch();

  const vote = (id, content) => {
    // console.log('vote', id);
    dispatch(voteAnecdote(id))
    dispatch(setNotification(`You voted '${content}'`));
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
            <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
