import { useEffect, useState } from "react";
import { calculateStatsForSet, addStats, initStatsItem } from "../utils/stats";

function StatsPanel({ match, selectedSet }) {
  const [gamesStats, setGamesStats] = useState([]);
  const [matchStats, setMatchStats] = useState(null);

  useEffect(() => {
    var gss = [];
    var ms = { homeStats: initStatsItem(), awayStats: initStatsItem() };
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
    if (selectedSet === match.games.length + 1)
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
                  <div className="stat place-items-center">
                    <div className="stat-title">Sideout %</div>
                    <div className="stat-value text-3xl text-info">
                      {getPercentString(stats.SideOuts, stats.SideoutTotal)}
                    </div>
                    <div className="stat-desc text-warning">
                      {stats.SideOuts}/{stats.SideoutTotal}
                    </div>
                  </div>

                  <div className="stat place-items-center">
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

                  <div className="stat place-items-center">
                    <div className="stat-title">Point %</div>
                    <div className="stat-value text-3xl text-info">
                      {getPercentString(stats.BreakPoints, stats.ServeTotal)}
                    </div>
                    <div className="stat-desc text-warning">
                      {stats.BreakPoints}/{stats.ServeTotal}
                    </div>
                  </div>

                  <div className="stat place-items-center">
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

                  <div className="stat place-items-center">
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

                  <div className="stat place-items-center">
                    <div className="stat-title">Plus</div>
                    <div className="stat-value text-3xl text-info">{stats.Plus}</div>
                  </div>

                  <div className="stat place-items-center">
                    <div className="stat-title">Minus</div>
                    <div className="stat-value text-3xl text-info">{stats.Minus}</div>
                  </div>

                  <div className="stat place-items-center">
                    <div className="stat-title">Pass Average</div>
                    <div className="stat-value text-3xl text-info">
                      {stats.PassAverage.toFixed(2)}
                    </div>
                  </div>

                  <div className="stat place-items-center">
                    <div className="stat-title">Block</div>
                    <div className="stat-value text-3xl text-info">{stats.Blck3}</div>
                  </div>

                  <div className="stat place-items-center">
                    <div className="stat-title">Dig</div>
                    <div className="stat-value text-3xl text-info">
                      {stats.Dig3 + stats.Dig2 + stats.Dig1}
                    </div>
                  </div>

                  <div className="stat place-items-center">
                    <div className="stat-title">Serve Ace</div>
                    <div className="stat-value text-3xl text-info">{stats.Serve3}</div>
                  </div>

                  <div className="stat place-items-center">
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
