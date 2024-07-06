import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useNotificationDispatch } from './NotificationContext'
import { getAnecdotes, createAnecdote, updateAnecdote } from './request'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const App = () => {

  const queryClient = useQueryClient()

  const dispatch = useNotificationDispatch()
  const NewNotification = (message, time) => {
    dispatch({ type: 'NEW_NOTIFICATION', payload: message })
    setTimeout(() => { dispatch({ type: 'CLEAR' }) }, time)
  }

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      NewNotification(`anecdote '${newAnecdote.content}' created`, 5000)
    },
    onError: (err) => {
      console.log(err)
      NewNotification(`${err.message}`, 5000)
    }
  })

  const handleNewAnecdote = (content) => {
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  const updatedAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.map(a => a.id === updatedAnecdote.id ? updatedAnecdote : a))
      ///////
      NewNotification(`anecdote '${updatedAnecdote.content}' voted`, 5000)
    }
  })

  const handleVote = (anecdote) => {
    console.log('vote')
    updatedAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false,
    retry: 1
  })

  //  const [notification, notificationDispatch] = useReducer(notificationReducer, '')

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <span>Error: {result.error.message}</span>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm onCreateHandler={handleNewAnecdote} />

      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
