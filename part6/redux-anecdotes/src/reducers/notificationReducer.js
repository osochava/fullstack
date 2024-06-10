import { createSlice, current } from '@reduxjs/toolkit'
import { addVoteOf, createAnecdote } from './anecdoteReducer'


const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification: (state, action) => {
      console.log(current(state))
      return action.payload
    },
    clearNotification: () => ''
  },
  extraReducers: (builder) => {
    builder
      .addCase(addVoteOf, (state, action) => {
        console.log(action);
        return `you voted '${action.payload.content}'`;
      })
      .addCase(createAnecdote, (state, action) => {
        console.log(action)
        return `you created new anecdote ${action.payload}`
      })
  }
})


export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer