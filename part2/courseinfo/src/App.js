import React from 'react';

const App = () => {

  const Header = (props) => {
    return <h1>{props.coursename}</h1>
  }

  const Part = ({part}) => {
    return <p>{part.name} {part.exercises}</p>
  }

  const Total = ({parts}) => {
    const total = parts.reduce((s, p) => {
      console.log('what is happening', s, p)
      return s + p.exercises 
    },0)
    console.log('Total',total);
    
    return (
      <p> <strong>total of {total} exercises
      </strong></p>
  )
  }

  const Content = ({parts}) => {
    return (
      <>
        {parts.map((part) => (
          <Part key = {part.id} part = {part} />
        ))}
      </>
  )
  }

  const Course = ({course}) => {
    return (
      <div>
        <Header coursename={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
  }
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }
  return <Course course={course} />
}

export default App;
