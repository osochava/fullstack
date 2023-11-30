import { useState } from 'react'

const Title = ({ title }) => {
  return (
    <h1>{title}</h1>
  )
}

const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  const title = "statistics"
  if (all === 0) {
    return (
      <>
        <Title title={title} />
        <p>"No feedback given"</p>
      </>
    )
  }
  else {
    return (
      <>
        <Title title={title} />
        <table>
          <tbody>
            <StatisticLine text="good" value={good} />
            <StatisticLine text="neutral" value={neutral} />
            <StatisticLine text="bad" value={bad} />
            <StatisticLine text="all" value={all} />
            <StatisticLine text="average" value={average} />
            <StatisticLine text="positive" value={positive} />
          </tbody>
        </table>
      </>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const updateStatistic = (updated_good, updated_bad, updated_neutral) => {
    const updatedAll = updated_good + updated_bad + updated_neutral
    const updatedAverage = (updated_good - updated_bad) / updatedAll
    const updatedPositive = updated_good / updatedAll
    setAll(updatedAll)
    setAverage(updatedAverage)
    setPositive(updatedPositive)
  }
  const goodHandleClick = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
    updateStatistic(updatedGood, neutral, bad)
  }

  const neutralHandleClick = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    updateStatistic(good, updatedNeutral, bad)
  }

  const badHandleClick = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
    updateStatistic(good, neutral, updatedBad)
  }

  return (
    <div>
      <Title title="give feedback" />
      <Button text="good" handleClick={goodHandleClick} />
      <Button text="neutral" handleClick={neutralHandleClick} />
      <Button text="bad" handleClick={badHandleClick} />
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive} />
    </div>
  )
}

export default App