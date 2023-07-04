import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, updateAnecdote, createAnecdotes} from './requests'
import React, { useState} from 'react'

import { useQuery, useMutation, useQueryClient} from 'react-query'


const App = () => {
  const queryClient = new useQueryClient()

  const [notification, setNotification] = useState(null)
  const showNotification = (message) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 10000)
  }

  // const updateAnecMutation = useMutation(updateAnecdote, {
  //   onSuccess: () => {
      
  //     queryClient.invalidateQueries('anecdotes')
  //   }
  // })

  // const handleVote = (anecdote) => {
  //   console.log(anecdote, 'is anecdote in handlevote before voting')
  //    updateAnecMutation.mutate({...anecdote, votes: anecdote.votes + 1})
  //    console.log(anecdote, 'is anecdote in handlevote after voting')
  // }

  const newAnecdoteMutation = useMutation(createAnecdotes, {
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes')
      // console.log('anecdotes in newAnecdoteMutation: ', anecdotes)
      queryClient.setQueryData('anecdotes', anecdotes.concat(newAnecdote))
    },
  });
    
  const anecdoteCreate = async (content) => {
    // console.log('content in anecdoteCreate: ', content)
    await newAnecdoteMutation.mutate({content, votes: 0})
  }


  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: (updatedAnecdote) => {
      // console.log('onSuccess updatedAnecdote: ', updatedAnecdote)
      // console.log('onSuccess updatedAnecdote.id: ', updatedAnecdote.id)
      queryClient.setQueryData('anecdotes', (prevANotes) =>
        prevANotes
          ? prevANotes.map((anecdote) =>
              anecdote.id === updatedAnecdote.id ? { ...anecdote, votes: updatedAnecdote.votes } : anecdote
            )
          : []
      )
      
    },
    
    
  })

  const handleVote = (anecdote) => {
    // console.log('Vote clicked:', anecdote)
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
    // console.log('updatedAnecdote:', updatedAnecdote)
    updateAnecdoteMutation.mutate(updatedAnecdote);

    // console.log('Vote after mutated:', anecdote)
  }

  
  const result = useQuery('anecdotes', getAnecdotes, {
    refetchOnWindowFocus: false,
    retry: 1,
  })

  // console.log(result);

  if (result.isLoading) {
    return <div>loading data...</div>;
  }  else if (result.isError) {
    return <div>anecdote service not available due to problems in server</div> 
  }

  const anecdotes = result.data;
  // console.log('After loading result data: ', result.data)
   
  
  return (
    <div>
      <h3>Anecdote app</h3>
      {notification && <Notification message={notification}/>}
      <AnecdoteForm createAnecdote = {anecdoteCreate} showNotification={showNotification}/>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App
