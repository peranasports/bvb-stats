import { useContext } from 'react'
import Spinner from "../components/layout/Spinner.jsx"
import PlayerItem from './PlayerItem'
import BVBStatsContext from '../context/BVBStatsContext'

function PlayerResults() {
  const { players, loading } = useContext(BVBStatsContext)

  if (!loading) {
    console.log(players)
    return (
      <div className='grid grid-cols-1 gap-8 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2'>
        {players.map((player) => (
          <PlayerItem key={player.id} player={player} />
        ))}
      </div>
    )
  } else {
    return <Spinner />
  }
}

export default PlayerResults
