import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

function PlayerItem({ player }) {

  const { id, lastName, firstName, countryCode } = player
  return (
    <div className='card shadow-md compact side bg-base-100'>
      <div className='flex-row items-center space-x-4 card-body'>
        <div>
          <div className='avatar'>
            <div className='shadow w-14 h-14'>
              <img src={require(`../components/assets/flags/${countryCode}.png`)} alt='Profile' />
            </div>
          </div>
        </div>
        <div>
          <Link
            className='text-base-content'
            to={`/player/${id}`}
          >
            <h2 className='card-title'>{firstName} {lastName.toUpperCase()}</h2>
          </Link>
          {countryCode.toUpperCase()}
        </div>
      </div>
    </div>
  )
}

PlayerItem.propTypes = {
  player: PropTypes.object.isRequired,
}

export default PlayerItem
