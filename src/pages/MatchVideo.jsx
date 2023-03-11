import { useState, useEffect, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player/lazy";
import EventsList from "../components/panels/EventsList";
import { toast } from "react-toastify";
import Select from "react-select";
import BVBStatsContext from "../context/BVBStatsContext";
import { updateMatchVideoOffset } from "../context/BVBStatsAction";
import StatsPanel from "../components/panels/StatsPanel";
import StatsRalliesList from "../components/panels/StatsRalliesList";

function MatchVideo() {
  const navigate = useNavigate();
  const { dispatch } = useContext(BVBStatsContext);
  const location = useLocation();
  const {
    match,
    vertObjects,
    videoFileUrl,
    videoFileName,
    onlineVideoFileUrl,
    dvFileData,
    vertFileData,
    player,
  } = location.state;
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoName, setVideoName] = useState(null);
  const [selectedStatsSet, setSelectedStatsSet] = useState(0);
  const [selectedSet, setSelectedSet] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [startVideoTime, setStartVideoTime] = useState(null);
  const [videoOffset, setVideoOffset] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef();
  const [allFilters, setAllFilters] = useState(null);
  const [teamAPlayers, setTeamAPlayers] = useState(null);
  const [teamBPlayers, setTeamBPlayers] = useState(null);
  const [selectedTeamAPlayers, setSelectedTeamAPlayers] = useState(null);
  const [selectedTeamBPlayers, setSelectedTeamBPlayers] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [showStatsRallies, setShowStatsRallies] = useState(false);
  const [statsRallies, setStatsRallies] = useState([]);
  const [, forceUpdate] = useState(0);

  const eventTypes = [
    { value: 0, label: "All Types" },
    { value: 1, label: "Serve" },
    { value: 2, label: "Serve-Receive" },
    { value: 3, label: "Set" },
    { value: 4, label: "Spike" },
    { value: 5, label: "Block" },
    { value: 6, label: "Defence" },
  ];
  const [selectedEventTypes, setSelectedEventTypes] = useState([eventTypes[0]]);
  const eventResults = [
    { value: 0, label: "All Results" },
    { value: 1, label: "0" },
    { value: 2, label: "1" },
    { value: 3, label: "2" },
    { value: 4, label: "3" },
  ];
  const [selectedEventResults, setSelectedEventResults] = useState([
    eventResults[0],
  ]);

  const playerReady = () => {
    if (!isReady) {
      setIsReady(true);
      playerRef.current.seekTo(0, "seconds");
    }
  };

  const doShowRallies = (obj) => {
    setStatsRallies(obj);
    setShowStatsRallies(true);
  };

  const doSelectEvent = (ev) => {
    setSelectedEvent(ev);

    if (match.videoOffset !== undefined) {
      const loc = ev.timeStamp.getTime() / 1000 - match.videoOffset;
      playerRef.current.seekTo(loc, "seconds");
    }

    // if (startVideoTime !== null && videoOffset !== null) {
    //   const secondsSinceEpoch = Math.round(ev.TimeStamp.getTime() / 1000);
    //   const loc = secondsSinceEpoch - startVideoTime + videoOffset;
    //   playerRef.current.seekTo(loc, "seconds");
    // }
  };

  const onStats = (vobj) => {
    const ss = !showStats;
    setShowStatsRallies(false)
    setShowStats(ss);
  };

  const onSynchVideo = () => {
    if (selectedEvent === null) {
      toast.error("Please select an event to synch with video!");
      return;
    }

    const currentEventTime = selectedEvent.timeStamp.getTime() / 1000;
    const voffset = playerRef.current.getCurrentTime();
    match.videoOffset = Number.parseInt(currentEventTime - voffset);

    dispatch({ type: "SET_LOADING", payload: { message: "" } });
    var ret = updateMatchVideoOffset(match.id, match.videoOffset);
    dispatch({ type: "UPDATE_MATCH_VIDEO_OFFSET", payload: ret });

    // const secondsSinceEpoch = Math.round(
    //   selectedEvent.TimeStamp.getTime() / 1000
    // );
    // setStartVideoTime(secondsSinceEpoch);
    // const voffset = playerRef.current.getCurrentTime();
    // setVideoOffset(voffset);
    // localStorage.setItem(videoFileName + "_offset", voffset.toString());
    // localStorage.setItem(
    //   videoFileName + "_startVideoTime",
    //   secondsSinceEpoch.toString()
    // );
  };

  const onDoFilters = () => {
    setAllFilters({
      teamAPlayers: selectedTeamAPlayers,
      teamBPlayers: selectedTeamBPlayers,
      eventTypes: selectedEventTypes,
      eventResults: selectedEventResults,
    });
  };

  const doSelectSet = (idx) => {
    setSelectedSet(idx);
  };

  const doSelectStatsSet = (idx) => {
    setSelectedStatsSet(idx);
  };

  useEffect(() => {
    // const vn =
    //   videoFileName !== undefined && videoFileName !== null
    //     ? videoFileName
    //     : onlineVideoFileUrl;
    // setVideoName(vn);
    // const vu =
    //   videoFileUrl === null || videoFileUrl === undefined || videoFileUrl === ""
    //     ? onlineVideoFileUrl
    //     : videoFileUrl;
    // setVideoUrl(vu);

    const vu = process.env.REACT_APP_BVBSTATS_VIDEO_URL + match.guid;
    setVideoUrl(vu);

    const tapls = teamPlayersList(match.teamA);
    setTeamAPlayers(tapls);
    const tbpls = teamPlayersList(match.teamB);
    setTeamBPlayers(tbpls);
    if (player !== undefined) {
      var ok = false;
      for (const tapl of tapls) {
        if (
          tapl.label.toLowerCase().includes(player.FirstName.toLowerCase()) &&
          tapl.label.toLowerCase().includes(player.LastName.toLowerCase())
        ) {
          setSelectedTeamAPlayers([tapl]);
          setSelectedTeamBPlayers([]);
          setAllFilters({
            teamAPlayers: [tapl],
            teamBPlayers: [],
            eventTypes: selectedEventTypes,
            eventResults: selectedEventResults,
          });
          ok = true;
          break;
        }
      }
      if (ok === false) {
        for (const tbpl of tbpls) {
          if (
            tbpl.label.toLowerCase().includes(player.FirstName.toLowerCase()) &&
            tbpl.label.toLowerCase().includes(player.LastName.toLowerCase())
          ) {
            setSelectedTeamBPlayers([tbpl]);
            setSelectedTeamAPlayers([]);
            ok = true;
            setAllFilters({
              teamAPlayers: [],
              teamBPlayers: [tbpl],
              eventTypes: selectedEventTypes,
              eventResults: selectedEventResults,
            });
            break;
          }
        }
      }
    } else {
      setSelectedTeamAPlayers([{ value: 0, label: "All Players" }]);
      setSelectedTeamBPlayers([{ value: 0, label: "All Players" }]);
    }
  }, []);

  function handleSelectEventTypes(data) {
    if (data.length === 0) {
      setSelectedEventTypes(data);
      return;
    }
    if (data[0].value === 0 && data.length > 1) {
      var ddd = [];
      for (var nd = 1; nd < data.length; nd++) {
        ddd.push(data[nd]);
      }
      setSelectedEventTypes(ddd);
      return;
    } else if (data[data.length - 1].value === 0 && data.length > 1) {
      setSelectedEventTypes([data[data.length - 1]]);
      return;
    }
    setSelectedEventTypes(data);
  }

  function handleSelectEventResults(data) {
    setSelectedEventResults(data);
  }

  function handleSelectTeamAPlayers(data) {
    if (data.length === 0) {
      setSelectedTeamAPlayers(data);
      return;
    }
    if (data[0].value === 0 && data.length > 1) {
      var ddd = [];
      for (var nd = 1; nd < data.length; nd++) {
        ddd.push(data[nd]);
      }
      setSelectedTeamAPlayers(ddd);
      return;
    } else if (data[data.length - 1].value === 0 && data.length > 1) {
      setSelectedTeamAPlayers([data[data.length - 1]]);
      return;
    }
    setSelectedTeamAPlayers(data);
  }

  function handleSelectTeamBPlayers(data) {
    if (data.length === 0) {
      setSelectedTeamBPlayers(data);
      return;
    }
    if (data[0].value === 0 && data.length > 1) {
      var ddd = [];
      for (var nd = 1; nd < data.length; nd++) {
        ddd.push(data[nd]);
      }
      setSelectedTeamBPlayers(ddd);
      return;
    } else if (data[data.length - 1].value === 0 && data.length > 1) {
      setSelectedTeamBPlayers([data[data.length - 1]]);
      return;
    }
    setSelectedTeamBPlayers(data);
  }

  const teamPlayersList = (team) => {
    var pls = [{ value: 0, label: "All Players" }];
    for (var np = 0; np < team.players.length; np++) {
      const pl = team.players[np];
      const plname = pl.firstName + " " + pl.lastName.toUpperCase();
      pls.push({ value: np + 1, label: plname, guid: pl.guid });
    }
    return pls;
  };

  if (match === null) {
    return <></>;
  }

  return (
    <>
      <div className="flex">
        <div className="flex-col w-100">
          {showStats ? (
            <div className="btn-group  mr-4">
                            <button
                className={
                  selectedStatsSet === 0
                    ? "btn btn-sm bg-gray-600 hover:btn-gray-900 btn-active"
                    : "btn btn-sm bg-gray-600 hover:btn-gray-900"
                }
                key={0}
                onClick={() => doSelectStatsSet(0)}
              >
                Match
              </button>
              {match.games.map((s, idx2) => (
                <button
                  className={
                    selectedStatsSet === idx2 + 1
                      ? "btn btn-sm bg-gray-600 hover:btn-gray-900 btn-active"
                      : "btn btn-sm bg-gray-600 hover:btn-gray-900"
                  }
                  key={idx2}
                  onClick={() => doSelectStatsSet(idx2 + 1)}
                >
                  Set {idx2 + 1}
                </button>
              ))}
            </div>
          ) : (
            <div className="btn-group  mr-4">
              {match.games.map((s, idx1) => (
                <button
                  className={
                    selectedSet === idx1 + 1
                      ? "btn btn-sm bg-gray-600 hover:btn-gray-900 btn-active"
                      : "btn btn-sm bg-gray-600 hover:btn-gray-900"
                  }
                  key={idx1}
                  onClick={() => doSelectSet(idx1 + 1)}
                >
                  Set {idx1 + 1}
                </button>
              ))}
            </div>
          )}
          <div className="flex h-[40vw] mt-4">
            <div className="flex-col w-[30vw] h-90 overflow-y-auto">
              {showStats ? (
                <div className="flex-col">
                  {showStatsRallies ? (
                    <StatsRalliesList
                      rallies={statsRallies.rallies}
                      events={statsRallies.events}
                      team={statsRallies.team}
                      title={statsRallies.title}
                      selectedGame={selectedStatsSet}
                      doSelectEvent={(ev) => doSelectEvent(ev)}
                      doClose={() => setShowStatsRallies(false)}
                    />
                  ) : (
                    <StatsPanel
                      match={match}
                      selectedSet={selectedStatsSet}
                      doShowRallies={(evs) => doShowRallies(evs)}
                    />
                  )}
                </div>
              ) : (
                <div className="w-[30vw]">
                  <EventsList
                    match={match}
                    filters={allFilters}
                    selectedSet={selectedSet}
                    doSelectEvent={(ev) => doSelectEvent(ev)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-col w-full ml-4">
          <div className="flex justify-between">
            <div className="flex gap-1">
              <label
                htmlFor="modal-filters"
                className="btn btn-sm bg-gray-600 hover:btn-gray-900"
              >
                Filters
              </label>
              <button
                className="btn btn-sm bg-gray-600 hover:btn-gray-900"
                onClick={() => onStats()}
              >
                Stats
              </button>
              <button
                className="btn btn-sm bg-gray-600 hover:btn-gray-900"
                onClick={() => onSynchVideo()}
              >
                Synch Video
              </button>
            </div>
            <div className="mx-2 flex-col">
              <div className="text-sm text-right text-warning font-semibold">
                {match.teamA.name.toUpperCase()} vs{" "}
                {match.teamB.name.toUpperCase()}
              </div>
              <div className="text-sm text-right">
                {match.matchDate.substring(0, 10)}
              </div>
            </div>
          </div>
          <div className="flex justify-center w-full">
            <ReactPlayer
              ref={playerRef}
              url={videoUrl}
              playing={true}
              width="100%"
              height="100%"
              controls={true}
              onReady={() => playerReady()}
            />
          </div>
        </div>
      </div>

      <input type="checkbox" id="modal-filters" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-7/12 max-w-5xl h-full">
          <h3 className="mb-4 font-bold text-2xl">Filters</h3>
          <div className="form">
            <div className="my-4">
              <div className="flex justify-between mt-4">
                <div className="flex=col justify-between w-full mx-2">
                  <p className="text-xs">Event Type</p>
                  <Select
                    id="eventTypesSelect"
                    name="eventTypesSelect"
                    onChange={handleSelectEventTypes}
                    className="mt-2 block w-full border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-lg sm:text-md"
                    options={eventTypes}
                    value={selectedEventTypes}
                    isMulti
                  />
                </div>
                <div className="flex=col justify-between w-full mx-2">
                  <p className="text-xs">Event Result</p>
                  <Select
                    id="eventResultsSelect"
                    name="eventResultsSelect"
                    onChange={handleSelectEventResults}
                    className="mt-2 block w-full border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-lg sm:text-md"
                    options={eventResults}
                    value={selectedEventResults}
                    isMulti
                  />
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <div className="flex=col justify-between w-full mx-2">
                  <p className="text-xs">{match.teamA.name} Players</p>
                  <Select
                    id="teamAPlayersSelect"
                    name="teamAPlayersSelect"
                    onChange={handleSelectTeamAPlayers}
                    className="mt-2 block w-full border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-lg sm:text-md"
                    options={teamAPlayers}
                    value={selectedTeamAPlayers}
                    isMulti
                  />
                </div>
                <div className="flex=col justify-between w-full mx-2">
                  <p className="text-xs">{match.teamB.name} Players</p>
                  <Select
                    id="teamBPlayersSelect"
                    name="teamBPlayersSelect"
                    onChange={handleSelectTeamBPlayers}
                    className="mt-2 block w-full border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-lg sm:text-md"
                    options={teamBPlayers}
                    value={selectedTeamBPlayers}
                    isMulti
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-action">
            <label
              htmlFor="modal-filters"
              className="btn"
              onClick={() => onDoFilters()}
            >
              Apply
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default MatchVideo;
