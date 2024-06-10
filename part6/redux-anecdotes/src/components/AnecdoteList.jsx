import { useSelector, useDispatch } from 'react-redux'

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
    dispatch({ type: 'anecdotes/addVoteOf', payload: anecdote })
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
