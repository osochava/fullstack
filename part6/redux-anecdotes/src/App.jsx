// import { useSelector, useDispatch } from 'react-redux'
// import { toggleVoteOf } from './reducers/anecdoteReducer'
// import AnecdoteForm from './components/AnecdoteForm'
// import AnecdoteList from './components/AnecdoteList'

// const App = () => {
//   const anecdotes = useSelector(state => state)
//   const dispatch = useDispatch()

//   const vote = (id) => {
//     console.log('vote', id)
//     dispatch(toggleVoteOf(id))
//   }

//   return (
//     <div>
//       <h2>Anecdotes</h2>
//       {anecdotes.map(anecdote =>
//         <div key={anecdote.id}>
//           <div>
//             {anecdote.content}
//           </div>
//           <div>
//             has {anecdote.votes}
//             <button onClick={() => vote(anecdote.id)}>vote</button>
//           </div>
//         </div>
//       )}
//       <h2>create new</h2>
//       <AnecdoteForm />
//     </div>
//   )
// }

// export default App


import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App