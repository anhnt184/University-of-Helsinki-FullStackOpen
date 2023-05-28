import React, { useState } from 'react';
import './App.css';

const StatisticLine = (props) => {
  return (
    <tr>
    <td>{props.text} </td>
    <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const positive = props.total !==0 ? ((props.good / props.total) * 100) : 0;
  const average = props.total !==0 ? (props.good-props.bad)/props.total : 0;
  const positiveWithPercentageStr = positive + '%';
  if (props.total === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <table>
      <tbody>
      <StatisticLine text="good" value ={props.good} />
      <StatisticLine text="neutral" value ={props.neutral} />
      <StatisticLine text="bad" value ={props.bad} />
      <StatisticLine text="all" value ={props.total} />
      <StatisticLine text="average" value ={average} />
      <StatisticLine text="positive" value ={positiveWithPercentageStr} />
      </tbody>
    </table>
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
      <Statistics good={good} bad={bad} neutral={neutral} total = {good + neutral + bad}/>
    </div>
  )
}

export default App;
