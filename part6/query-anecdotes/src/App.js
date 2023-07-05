import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { getAnecdotes, updateAnecdote, createAnecdotes } from "./requests";
import React from "react";

import { useNotificationDispatch } from "./reducers/NotificationContext";

import { useQuery, useMutation, useQueryClient } from "react-query";

const App = () => {
  const queryClient = new useQueryClient();
  const { showNotification } = useNotificationDispatch();

  const newAnecdoteMutation = useMutation(createAnecdotes, {
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData("anecdotes");
      queryClient.setQueryData("anecdotes", anecdotes.concat(newAnecdote));
    },
  });

  const anecdoteCreate = async (content) => {
    // console.log('content in anecdoteCreate: ', content)
    await newAnecdoteMutation.mutate({ content, votes: 0 });
    showNotification(`Anecdote  '${content}' added successfully`);
  };

  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: (updatedAnecdote) => {
      queryClient.setQueryData("anecdotes", (prevANotes) =>
        prevANotes
          ? prevANotes.map((anecdote) =>
              anecdote.id === updatedAnecdote.id
                ? { ...anecdote, votes: updatedAnecdote.votes }
                : anecdote
            )
          : []
      );
    },
  });

  const handleVote = (anecdote) => {
    // console.log('Vote clicked:', anecdote)
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
    updateAnecdoteMutation.mutate(updatedAnecdote);
    showNotification(`Anecdote  '${updatedAnecdote.content}' voted`);
  };

  const result = useQuery("anecdotes", getAnecdotes, {
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // console.log(result);

  if (result.isLoading) {
    return <div>loading data...</div>;
  } else if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }

  const anecdotes = result.data;
  // console.log('After loading result data: ', result.data)

  const AnecdoteItem = ({ anecdote, handleVote }) => {
    return (
      <div key={anecdote.id}>
        <div>{anecdote.content}</div>
        <div>
          has {anecdote.votes}
          <button onClick={() => handleVote(anecdote)}>vote</button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm createAnecdote={anecdoteCreate} />
      {anecdotes.map((anecdote) => (
        <AnecdoteItem
          key={anecdote.id}
          anecdote={anecdote}
          handleVote={handleVote}
        />
      ))}
    </div>
  );
};

export default App;
