import {useState} from 'react';

const NextButton = ({ handleClick }) => {
  return (
    <button onClick={handleClick}>next anecdote</button>
  );
};

const VoteButton = ({ handleVote }) => {
  return (
    <button onClick={handleVote}>vote</button>
  );
};

const Button = ({ text, votes, selected, handleVote, handleClick }) => {
  return (
    <>
      <p>{text}</p>
      <p>has {votes[selected]} votes</p>
      <VoteButton handleVote={handleVote} />
      <NextButton handleClick={handleClick} />
    </>
  );
};

function App() {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));

  const handleNextClick = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomIndex);
  };

  const handleVote = () => {
    const copyVotes = [...votes];
    copyVotes[selected] += 1;
    setVotes(copyVotes);
  };

  return (
    <div>
      <Button
        text={anecdotes[selected]}
        votes={votes}
        selected={selected}
        handleVote={handleVote}
        handleClick={handleNextClick}
      />
    </div>
  );
}

export default App;
