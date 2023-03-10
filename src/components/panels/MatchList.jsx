import React from "react";
import MatchItem from "./MatchItem";

function MatchList({ team, onMatchSelected }) {
  const doMatchSelected = (m) => {
    onMatchSelected(m);
  };
  return (
    <>
      <div>
        {team &&
          team.matches &&
          team.matches.map((match, idx) => (
            <MatchItem
              key={idx}
              match={match}
              onMatchSelected={(m) => doMatchSelected(m)}
            />
          ))}
      </div>
    </>
  );
}

export default MatchList;
