const Header = (props) => {
    console.log(props)
    return (
        <h1>{props.course}</h1>
    )
}

const Part = ({ part }) => {
    console.log(part)
    return (
        <p>{part.name} {part.exercises}</p>
    )
}

const Content = ({ parts }) => {
    return (
        <>
            {parts.map(part => <Part key={part.id} part={part} />)}
        </>
    )
}

const Total = ({ parts }) => {

    var total = parts.reduce((s, p) => s + p.exercises, 0)
    return (
        <>
            <h4>total of {total} exercises</h4>
        </>
    )
}

const Course = ({ course }) => {

    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}

export default Course