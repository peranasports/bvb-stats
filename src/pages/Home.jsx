import React from "react";
import PlayerSearch from "../player/PlayerSearch";
import PlayerResults from "../player/PlayerResult";
import TeamSearch from "../team/TeamSearch";
import TeamResults from "../team/TeamResult";

function Home() {
  return (
    <div className="flex">
    {/* <div>
      <PlayerSearch />
      <PlayerResults />
    </div> */}
    <div>
      <TeamSearch />
      <TeamResults />
    </div>

    </div>
  );
}

export default Home;
