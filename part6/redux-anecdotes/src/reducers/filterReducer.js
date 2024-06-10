import { createSlice, current } from '@reduxjs/toolkit'

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    setFilter(state, action) {
      return action.payload
    }
  }

})



// const filterReducer = (state = '', action) => {
//   console.log('state now: ', state)
//   console.log('action', action)
//   switch (action.type) {
//     case 'SET_FILTER':
//       return action.payload
//     default:
//       return state
//   }
// }

// export const updateFilter = (content) => {
//   return {
//     type: 'SET_FILTER',
//     payload: content
//   }

// }

export default filterSlice.reducer