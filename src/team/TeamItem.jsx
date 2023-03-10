import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function TeamItem({ team }) {
  const navigate = useNavigate();
  const { id, name, code, countryCode } = team;

  const doTeam = () => {
    const st = {
      team: team,
    };
    navigate("/team", { state: st });
  };

  return (
    <div className="card shadow-md compact side bg-base-100">
      <div className="flex-row items-center space-x-4 card-body">
        <div>
          <div className="avatar">
            <div className="shadow w-14 h-14">
              <img
                src={require(`../components/assets/flags/${countryCode}.png`)}
                alt="Profile"
              />
            </div>
          </div>
        </div>
        <div>
            <p className="text-lg" onClick={() => doTeam()}>{team.name}</p>
          {/* <Link className="text-base-content" to={`/team/${id}`}>
            <h2 className="card-title">{name}</h2>
          </Link>
          {countryCode.toUpperCase()} */}
        </div>
      </div>
    </div>
  );
}

TeamItem.propTypes = {
  team: PropTypes.object.isRequired,
};

export default TeamItem;
