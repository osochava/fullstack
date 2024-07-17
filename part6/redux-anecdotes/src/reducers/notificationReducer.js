import { createSlice, current } from '@reduxjs/toolkit'
import { addVoteOf, appendAnecdote } from './anecdoteReducer'


const initialState = {
  message: '',
  timer: null
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action) => {
      console.log(current(state))
      console.log(action)
      if (state.timer)
        clearTimeout(state.timer)
      return action.payload
    },
    clearNotification: () => initialState
  }
})


export const { setNotification, clearNotification } = notificationSlice.actions

export const setNotificationWithTimer = (message, delay) => {
  return dispatch => {
    const timer = setTimeout(() => dispatch(clearNotification()), delay * 1000)
    dispatch(setNotification({ message: message, timer: timer }))
  }
}

export default notificationSlice.reducer