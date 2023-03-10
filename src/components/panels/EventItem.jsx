import React from "react";
import { eventString, eventGradeString, subEventString } from "../utils/utils";

function EventItem({ event, isSelected, onEventSelected }) {
  const doEventSelect = () => {
    onEventSelected(event);
  };

  const background = () => {
    if (isSelected === false) {
      return "mb-2 rounded-xl card-compact bg-gray-800 hover:bg-base-300";
    } else {
      return "mb-2 rounded-xl card-compact bg-blue-800 hover:bg-blue-900";
    }
  };

  const getEventStringColor = (e) => {
    var s = "pl-2 text-md";
    if (e.eventType === 20 || e.eventType === 250) {
      s += " text-gray-600";
    }
    if (e.eventGrade === 0) {
      s += " text-error";
    } else if (e.eventGrade === 3 && e.eventGrade.eventType !== 2) {
      s += " text-success";
    } else if (e.eventGrade === 2 && e.eventGrade.eventType === 5) {
      s += " text-success";
    } else {
      s += " text-warning";
    }
    return s;
  };

  return (
    <div className={background()} onClick={() => doEventSelect()}>
      <div className="">
        {event.isHome ? (
          <div className="text-left bg-gray-900 text-gray-500">
            {event.player === undefined ? (
              <></>
            ) : (
              <p className="pl-2 text-md font-semibold">
                {event.player.firstName} {event.player.lastName.toUpperCase()}
              </p>
            )}
          </div>
        ) : (
          <div className="text-right bg-gray-900 text-gray-500">
            {event.player === undefined ? (
              <></>
            ) : (
              <p className="pr-2 text-md font-semibold">
                {event.player.firstName} {event.player.lastName.toUpperCase()}
              </p>
            )}
          </div>
        )}
        <div className="flex justify-between">
          <p className={getEventStringColor(event)}>
            {eventString(event)} {subEventString(event)}{" "}
            {eventGradeString(event)}
          </p>
          <p className="pr-2 pb-2 text-md">
            ({event.game.gameNumber}) {event.teamScore}-{event.oppositionScore}
          </p>
        </div>
      </div>
    </div>
  );
}

export default EventItem;
