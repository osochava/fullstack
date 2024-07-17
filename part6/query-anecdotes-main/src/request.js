import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () =>
  axios.get(baseUrl).then(res => res.data)


export const createAnecdote = newAnecdote =>
  axios.post(baseUrl, newAnecdote).then(res => res.data).catch(error => {
    const message = error.response === null ? error.message : error.response.data.error
    console.error(message)
    throw new Error(message)
  })

export const updateAnecdote = updatedAnecdote =>
  axios.put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote).then(res => res.data)