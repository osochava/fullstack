import { createSlice, current } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addVoteOf(state, action) {
      const id = action.payload.id
      return state.map(anecdote => anecdote.id !== id ? anecdote : action.payload)
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { addVoteOf, setAnecdotes, appendAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const addVoteOfAnecdote = anecdote => {
  return async (dispatch, getState) => {
    const id = anecdote.id
    const anecdoteToChange = getState().anecdotes.find(a => a.id === id)
    const anecdoteForUpdate = { ...anecdoteToChange, votes: anecdoteToChange.votes + 1 }
    const updatedAnecdote = await anecdoteService.updateAnecdote(anecdoteForUpdate, id)
    dispatch(addVoteOf(updatedAnecdote))
  }
}




export default anecdoteSlice.reducer