import { useSelector, useDispatch } from 'react-redux'
import { addVoteOfAnecdote } from '../reducers/anecdoteReducer'
import { setNotificationWithTimer } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <li key={anecdote.id}>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </li>
  )
}

const AnecdoteList = () => {

  const compareByVotes = (firstItem, secondItem) => {
    return secondItem.votes - firstItem.votes;
  }

  const SortAnecdotes = (prevState) => {
    return [...prevState].sort(compareByVotes)
  }

  const anecdotes = useSelector(state =>
    SortAnecdotes(state.anecdotes.filter(a => a.content.includes(state.filter))))
  const dispatch = useDispatch()

  const vote = (anecdote) => {
    console.log('vote', anecdote)
    dispatch(addVoteOfAnecdote(anecdote))
    dispatch(setNotificationWithTimer(`you voted '${anecdote.content}'`, 5))
  }

  return (
    <ul>
      {anecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => vote(anecdote)}
        />
      )}
    </ul>
  )
}

export default AnecdoteList
