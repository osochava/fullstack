import { useSelector, useDispatch } from 'react-redux'
import { toggleVoteOf } from '../reducers/anecdoteReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <li key={anecdote.id}>
      {anecdote.content}
      has {anecdote.votes}
      <button onClick={handleClick}>vote</button>
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

  const anecdotes = useSelector(state => SortAnecdotes(state))
  const dispatch = useDispatch()

  const vote = (id) => {
    console.log('vote', id)
    dispatch(toggleVoteOf(id))
  }

  return (
    <ul>
      {anecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => vote(anecdote.id)}
        />
      )}
    </ul>
  )
}

export default AnecdoteList
