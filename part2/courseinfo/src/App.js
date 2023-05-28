const App = () => {

  const Header = (props) => {
    return <h1>{props.coursename}</h1>
  }

  const Part = (props) => {
    return <p>{props.partname} {props.partexercise}</p>
  }

  const Content = (props) => {
    return (
      <>
        <Part partname={props.parts[0].name} partexercise={props.parts[0].exercises} />
        <Part partname={props.parts[1].name} partexercise={props.parts[1].exercises} />
        <Part partname={props.parts[2].name} partexercise={props.parts[2].exercises} />
      </>
  )
  }

  const Course = (props) => {
    return (
      <div>
        <Header coursename={props.course.name} />
        <Content parts={props.course.parts} />
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
