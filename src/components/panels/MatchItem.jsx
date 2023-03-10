import { useEffect, useState } from "react";

function MatchItem({ match, onMatchSelected }) {
  const [, forceUpdate] = useState(0);

  const doMatchSelect = () => {
    match.isSelected = !match.isSelected;
    forceUpdate((n) => !n);
    onMatchSelected(match);
  };

  return (
    <div>
      <div
        className={
          match && match.isSelected ?
          "mb-1 rounded-sm px-2 bg-blue-900 hover:bg-blue-800" :
          "mb-1 rounded-sm px-2 bg-base-200 hover:bg-base-300"
        }
        onClick={() => doMatchSelect()}
      >
        {/* <div className="flex"> */}
          {/* <div className="form-control">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                checked={match.isSelected}
                className="checkbox"
              />
            </label>
          </div> */}
          <div className="flex-col ml-4">
            <div className="flex justify-between">
              <div className="shadow">
                <img
                  className="shadow w-12 h-12"
                  src={require(`../assets/flags/${match.teamA.countryCode}.png`)}
                  alt="Profile"
                />
              </div>
              <div className="flex-col">
                <p className="text-md font-semibold">{match.teamA.name}</p>
                <p className="text-md font-semibold">{match.teamB.name}</p>
              </div>
              <div className="shadow">
                <img
                  className="shadow w-12 h-12"
                  src={require(`../assets/flags/${match.teamB.countryCode}.png`)}
                  alt="Profile"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <p className="pl-2 pb-2 text-sm">{match.matchScore}</p>
              <p className="pl-2 pb-2 text-sm">{match.matchDate.substring(0,10)}</p>
            </div>
          </div>
        </div>
      </div>
    // </div>
  );
}

export default MatchItem;
