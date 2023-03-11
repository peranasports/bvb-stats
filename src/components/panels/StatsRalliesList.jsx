import { useState, useEffect } from "react";
import EventItem from "./EventItem";
import RallyItem from "./RallyItem";

function StatsRalliesList({
  rallies,
  events,
  title,
  team,
  selectedGame,
  doSelectEvent,
  doClose,
}) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState(null)
  const [filteredRallies, setFilteredRallies] = useState(null)

  const onEventSelected = (r) => {
    setSelectedEvent(r);
    doSelectEvent(r);
  };

  useEffect(() => {
    if (rallies !== null)
    {
      var rs = []
      for (const rally of rallies)
      {
        if (selectedGame === 0 || rally.gameNumber === selectedGame)
        {
          rs.push(rally)
        }
      }
      setFilteredRallies(rs)
    }
    if (events !== null)
    {
      var evs = []
      for (const event of events)
      {
        if (selectedGame === 0 || event.game.gameNumber === selectedGame)
        {
          evs.push(event)
        }
      }
      setFilteredEvents(evs)
    }
  }, [selectedGame, rallies]);

  if (rallies === undefined) {
    return <></>;
  }

  return (
    <>
      <div className="flex justify-end">
        <button
          className="btn btn-sm bg-gray-600 ml-4"
          onClick={() => doClose()}
        >
          Close
        </button>
      </div>

      <div className="flex gap-2 justify-center my-2">
        <div className="shadow">
          <img
            className="shadow w-8 h-8"
            src={require(`../assets/flags/${
              team !== null && team.countryCode
            }.png`)}
            alt="Profile"
          />
        </div>
        <p className="mt-1 text-xl font-bold">
          {team.code} - {title}
        </p>
      </div>

      {events === null ? (
        <div className="bg-gray-700">
          {filteredRallies &&
            filteredRallies.map((rally, id) => (
              <div
                key={id}
                tabIndex={0}
                className="collapse collapse-arrow border border-base-300 bg-base-500"
              >
                <input type="checkbox" className="peer" />
                <div className="collapse-title">
                  <div className="flex justify-between">
                    <div className="flex gap-2 justify-center">
                      <div className="shadow">
                        <img
                          className="shadow w-8 h-8"
                          src={require(`../assets/flags/${
                            team !== null && team.countryCode
                          }.png`)}
                          alt="Profile"
                        />
                      </div>
                      <p className="mt-1 text-lg">
                        {rally.serveEvent.player.lastName} serves
                      </p>
                    </div>

                    <p className="mt-1 text-lg">
                      ({rally.gameNumber}) {rally.homeScore}-{rally.awayScore}
                    </p>
                  </div>
                </div>
                <div className="collapse-content" id={id}>
                  {rally.events.map((event, eid) => (
                    <EventItem
                      key={eid}
                      event={event}
                      isSelected={event === selectedEvent}
                      onEventSelected={(ev) => onEventSelected(ev)}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div>
          {filteredEvents && filteredEvents.map((event, eid) => (
            <EventItem
              key={eid}
              event={event}
              isSelected={event === selectedEvent}
              onEventSelected={(ev) => onEventSelected(ev)}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default StatsRalliesList;
