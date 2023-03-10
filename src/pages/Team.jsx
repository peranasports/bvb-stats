import { useState, useEffect, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import BVBStatsContext from '../context/BVBStatsContext'
import { getMatchesForTeam } from '../context/BVBStatsAction'
import MatchList from '../components/panels/MatchList'
import TeamDetail from '../components/panels/TeamDetail'
import { initWithZippedBuffer } from '../components/utils/psbvbFile'

function Team() {
    const location = useLocation()
    const navigate = useNavigate()
    const { team } = location.state
    const [selectedMatch, setSelectedMatch] = useState(null)
    const { matches, loading, dispatch } = useContext(BVBStatsContext)

    const onMatchSelected = (m) =>
    {
        setSelectedMatch(m)
        const st = {
            match:m,
        }
        navigate("/matchvideo", { state:st })
    }

    useEffect(() => {
        dispatch({ type: 'SET_LOADING' })
        const getMatchesData = async () => {
            const matchesData = await getMatchesForTeam(team.id)
            dispatch({ type: 'GET_MATCHES_FOR_TEAM', payload: matchesData })
            for (var m of matchesData)
            {
                m.isSelected = false
                const xm = initWithZippedBuffer(m.psbvbFile)
                m.teamA = xm.teamA
                m.teamB = xm.teamB
                m.games = xm.games
                if (team.guid === m.teamA.guid)
                {
                    team.players = m.teamA.players
                }
                else if (team.guid === m.teamB.guid)
                {
                    team.players = m.teamB.players
                }
            }
            team.matches = matchesData
        }
        getMatchesData()
        // console.log(team)
    }, [team])
  return (
    <>
    <div className="flex">
        <div className="w-[30vw]">
            <MatchList team={team} onMatchSelected={(m) => onMatchSelected(m)}/>
        </div>
        <div className="w-[60vw]">
            <TeamDetail team={team} />
        </div>
    </div>
    </>
  )
}

export default Team