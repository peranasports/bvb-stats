import { useContext } from 'react'
import Spinner from "../components/layout/Spinner.jsx"
import TeamItem from './TeamItem'
import BVBStatsContext from '../context/BVBStatsContext'

function TeamResults() {
  const { teams, loading } = useContext(BVBStatsContext)

  if (!loading) {
    console.log(teams)
    return (
      <div className='grid grid-cols-1 gap-8 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2'>
        {teams.map((team) => (
          <TeamItem key={team.id} team={team} />
        ))}
      </div>
    )
  } else {
    return <Spinner />
  }
}

export default TeamResults
