import { useState, useContext } from 'react'
import BVBStatsContext from '../context/BVBStatsContext'
import { searchPlayers } from '../context/BVBStatsAction'
import { toast } from "react-toastify";

function PlayerSearch() {
  const [text, setText] = useState('')
  const { players, dispatch } = useContext(BVBStatsContext)
  const handleChange = (e) => setText(e.target.value)
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (text === '') {
        toast.error("Please enter a player's name to search.");
    } else {
      dispatch({ type: 'SET_LOADING' })
      const players = await searchPlayers(text)
      dispatch({ type: 'GET_PLAYERS', payload: players })
      setText('')
    }
  }

  return (
    <div className='grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 mb-8 gap-8'>
      <div>
        <form onSubmit={handleSubmit}>
          <div className='form-control pt-6'>
            <div className='relative'>
              <input
                type='text'
                className='w-full pr-20 bg-gray-200 input input-md text-black'
                placeholder='Search Player'
                value={text}
                onChange={handleChange}
              />
              <button
                type='submit'
                className='absolute top-0 right-0 rounded-l-none w-24 btn btn-md'>
                Go
              </button>
            </div>
          </div>
        </form>
      </div>
      {players.length > 0 && (
        <div className='pt-6'>
          <button
            onClick={() => dispatch({ type: 'CLEAR_PLAYERS_SEARCH' })}
            className='btn btn-ghost btn-md'>
            Clear
          </button>
        </div>
      )}
    </div>
  )
}

export default PlayerSearch