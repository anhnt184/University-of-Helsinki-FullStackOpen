import React from 'react';
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

  const Content = ({course}) => {
    return (
      <div>
        <Heading2 coursename={course.name} />
        {course.parts.map((part) => (
          <Part key = {part.id} part = {part} />
        ))}
        <Total parts={course.parts} />
      </div>
  )
  }
 const Course = ({courses}) => {
    return (
      <>
        <h1>Web development curriculum</h1>
        {courses.map((course) => (
          <Content key = {course.id} course = {course} />
        ))}
      </>
  )
  }
  export default Course;