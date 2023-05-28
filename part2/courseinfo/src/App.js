import React from 'react';

const App = () => {

  const Heading2 = (props) => {
    return <h2>{props.coursename}</h2>
  }

  const Part = ({part}) => {
    return <p>{part.name} {part.exercises}</p>
  }

  const Total = ({parts}) => {
    const total = parts.reduce((s, p) => {
      return s + p.exercises 
    },0)
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
        <Heading2 coursename={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
  }

  const Courses = ({courses}) => {
    return (
      <>
        <h1>Web development curriculum</h1>
        {courses.map((course) => (
          <Course key = {course.id} course = {course} />
        ))}
      </>
  )
  }

  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
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
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]
  return <Courses courses={courses} />
}

export default App;
