import { useEffect, useState } from "react";
import { calculateStatsForSet, addStats, initStatsItem } from "../utils/stats";

function StatsPanel({ match, selectedSet, doShowRallies }) {
  const [gamesStats, setGamesStats] = useState([]);
  const [matchStats, setMatchStats] = useState(null);

  useEffect(() => {
    var gss = [];
    var ms = { homeStats: initStatsItem(), awayStats: initStatsItem() };
    ms.homeStats.Team = match.teamA;
    ms.awayStats.Team = match.teamB;
    for (const game of match.games) {
      const gs = calculateStatsForSet(game, match);
      addStats(ms.homeStats, gs.homeStats);
      addStats(ms.awayStats, gs.awayStats);
      gss.push(gs);
    }
    setGamesStats(gss);
    setMatchStats(ms);
  }, []);

  function getPercentString(val, count) {
    return count === undefined || count === 0
      ? "0"
      : Number.parseInt((val * 100) / count).toString();
  }
  const getStats = () => {
    if (selectedSet === 0)
    {
      return matchStats === null
      ? null
      : [matchStats.homeStats, matchStats.awayStats];
    }
    else
    {
      return gamesStats === null
      ? null
      : [gamesStats[selectedSet - 1].homeStats, gamesStats[selectedSet - 1].awayStats];
    }
  };

  const showRallies = (rs, events, team, title) =>
  {
    doShowRallies({rallies:rs, events:events, team:team, title:title})
  }

  if (matchStats === null) {
    return <></>;
  }

  return (
    <>
      <div className="flex justify-between gap-2">
        {matchStats &&
          getStats().map((stats, idx) => (
            <div className="flex" key={idx}>
              <div className="flex-col">
                <div className="flex gap-2 justify-center">
                  <div className="shadow">
                    <img
                      className="shadow w-8 h-8"
                      src={require(`../assets/flags/${
                        idx === 0
                          ? match.teamA.countryCode
                          : match.teamB.countryCode
                      }.png`)}
                      alt="Profile"
                    />
                  </div>
                  <p className="mt-1 text-xl font-bold">{idx === 0 ? match.teamA.code : match.teamB.code}</p>
                </div>
                <div className="stats stats-vertical shadow">
                  <div className="stat place-items-center" onClick={() => showRallies(stats.listSideouts, null, stats.Team, "Sideouts Success")}>
                    <div className="stat-title">Sideout %</div>
                    <div className="stat-value text-3xl text-info">
                      {getPercentString(stats.SideOuts, stats.SideoutTotal)}
                    </div>
                    <div className="stat-desc text-warning">
                      {stats.SideOuts}/{stats.SideoutTotal}
                    </div>
                  </div>

                  <div className="stat place-items-center" onClick={() => showRallies(stats.listSideoutErrors, null, stats.Team, "Sideout Errors")} >
                    <div className="stat-title">Sideout Error %</div>
                    <div className="stat-value text-3xl text-info">
                      {getPercentString(
                        stats.SideOutErrors,
                        stats.SideoutTotal
                      )}
                    </div>
                    <div className="stat-desc text-warning">
                      {stats.SideOutErrors}/{stats.SideoutTotal}
                    </div>
                  </div>

                  <div className="stat place-items-center" onClick={() => showRallies(stats.listPoints, null, stats.Team, "Break Points")}>
                    <div className="stat-title">Point %</div>
                    <div className="stat-value text-3xl text-info">
                      {getPercentString(stats.BreakPoints, stats.ServeTotal)}
                    </div>
                    <div className="stat-desc text-warning">
                      {stats.BreakPoints}/{stats.ServeTotal}
                    </div>
                  </div>

                  <div className="stat place-items-center" onClick={() => showRallies(stats.listSideoutFirstBalls, null, stats.Team, "Sideout First Phase")}>
                    <div className="stat-title">Sideout 1st Phase %</div>
                    <div className="stat-value text-3xl text-info">
                      {getPercentString(
                        stats.SideOutFirstBalls,
                        stats.SideoutTotal
                      )}
                    </div>
                    <div className="stat-desc text-warning">
                      {stats.SideOutFirstBalls}/{stats.SideoutTotal}
                    </div>
                  </div>

                  <div className="stat place-items-center" onClick={() => showRallies(stats.listSideoutOn2s, null, stats.Team, "Sideout On 2s")}>
                    <div className="stat-title">Sideout On 2 Kill %</div>
                    <div className="stat-value text-3xl text-info">
                      {getPercentString(
                        stats.SideOutOn2Kills,
                        stats.SideOutOn2s
                      )}
                    </div>
                    <div className="stat-desc text-warning">
                      {stats.SideOutOn2Kills}/{stats.SideOutOn2s}
                    </div>
                  </div>

                  <div className="stat place-items-center" onClick={() => showRallies(null, stats.listPlus, stats.Team, "Plus")}>
                    <div className="stat-title">Plus</div>
                    <div className="stat-value text-3xl text-info">{stats.Plus}</div>
                  </div>

                  <div className="stat place-items-center" onClick={() => showRallies(null, stats.listMinus, stats.Team, "Minus")}>
                    <div className="stat-title">Minus</div>
                    <div className="stat-value text-3xl text-info">{stats.Minus}</div>
                  </div>

                  <div className="stat place-items-center">
                    <div className="stat-title">Pass Average</div>
                    <div className="stat-value text-3xl text-info">
                      {stats.PassAverage.toFixed(2)}
                    </div>
                  </div>

                  <div className="stat place-items-center" onClick={() => showRallies(null, stats.listBlocks, stats.Team, "Blocks")}>
                    <div className="stat-title">Block</div>
                    <div className="stat-value text-3xl text-info">{stats.Blck3}</div>
                  </div>

                  <div className="stat place-items-center" onClick={() => showRallies(null, stats.listDigs, stats.Team, "Digs")}>
                    <div className="stat-title">Dig</div>
                    <div className="stat-value text-3xl text-info">
                      {stats.Dig3 + stats.Dig2 + stats.Dig1}
                    </div>
                  </div>

                  <div className="stat place-items-center" onClick={() => showRallies(null, stats.listAces, stats.Team, "Serve Aces")}>
                    <div className="stat-title">Serve Ace</div>
                    <div className="stat-value text-3xl text-info">{stats.Serve3}</div>
                  </div>

                  <div className="stat place-items-center" onClick={() => showRallies(null, stats.listServes, stats.Team, "Positive Serves")}>
                    <div className="stat-title">Positive Serve</div>
                    <div className="stat-value text-3xl text-info">
                      {getPercentString(stats.PositiveServe, stats.ServeTotal)}
                    </div>
                    <div className="stat-desc text-warning">
                      {stats.PositiveServe}/{stats.ServeTotal}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default StatsPanel;
