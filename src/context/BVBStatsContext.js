import { createContext, useReducer } from 'react'
import BVBStatsReducer from './BVBStatsReducer'

const BVBStatsContext = createContext()

export const BVBStatsProvider = ({ children }) => {
  const initialState = {
    players: [],
    teams: [],
    matches: [],
    player: {},
    match: {},
    loading: false,
  }

  const [state, dispatch] = useReducer(BVBStatsReducer, initialState)

  return (
    <BVBStatsContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </BVBStatsContext.Provider>
  )
}

export default BVBStatsContext
