const filterReducer = (state = '', action) => {
  console.log('state now: ', state)
  console.log('action', action)
  switch (action.type) {
    case 'SET_FILTER':
      return action.payload
    default:
      return state
  }
}

export const updateFilter = (content) => {
  return {
    type: 'SET_FILTER',
    payload: content
  }

}

export default filterReducer