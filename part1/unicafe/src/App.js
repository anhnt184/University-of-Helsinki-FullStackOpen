import React, { useState } from 'react';
import './App.css';

const Display = (props) => {
  const percentage = props.total !==0 ? ((props.good / props.total) * 100) : 0;
  const average = props.total !==0 ? (props.good-props.bad)/props.total : 0;
  return (
    <div>
      <p>good {props.good}</p> 
      <p>neural {props.neutral} </p>
      <p>bad {props.bad} </p>
      <p>all {props.total} </p>
      <p>average {average} </p>
      <p>positive {percentage} %</p>
    </div>
  )
}

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  
  const handleGoodClick = () => {
    setGood(good + 1)
  }
  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
  }
  const Heading = (props) => {
    return <h1>{props.text}</h1>
  }

  return (
    <div>
      <Heading text = "give feedback" />
      <Button handleClick={handleGoodClick} text="good" />
      <Button handleClick={handleNeutralClick} text="neutral" />
      <Button handleClick={handleBadClick} text="bad" />
      <Heading text = "statistics" />
      <Display good={good} bad={bad} neutral={neutral} total = {good + neutral + bad}/>
    </div>
  )
}

export default App;
