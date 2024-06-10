import { configureStore } from '@reduxjs/toolkit'
import anectdoteReducer from './anecdoteReducer'
import filterReducer from './filterReducer'
import notificationReducer from './notificationReducer'

const store = configureStore({
  reducer: {
    anecdotes: anectdoteReducer,
    filter: filterReducer,
    notification: notificationReducer
  }
})

export default store