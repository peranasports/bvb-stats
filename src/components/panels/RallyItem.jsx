import React from "react";

function RallyItem({ rally, isSelected, onRallySelected }) {
  const doEventSelect = () => {
    onRallySelected(rally);
  };

  const background = () => {
    if (isSelected === false) {
      return "mb-2 rounded-xl card-compact bg-gray-800 hover:bg-base-300";
    } else {
      return "mb-2 rounded-xl card-compact bg-blue-800 hover:bg-blue-900";
    }
  };

  const getEventStringColor = (r) => {
    var s = "pl-2 text-md";
    // if (e.eventType === 20 || e.eventType === 250) {
    //   s += " text-gray-600";
    // }
    // if (e.eventGrade === 0) {
    //   s += " text-error";
    // } else if (e.eventGrade === 3 && e.eventGrade.eventType !== 2) {
    //   s += " text-success";
    // } else if (e.eventGrade === 2 && e.eventGrade.eventType === 5) {
    //   s += " text-success";
    // } else {
    //   s += " text-warning";
    // }
    return s;
  };

  return <>
    <div className={background()} onClick={() => doEventSelect()}>
      <div className="">
        {rally.serveEvent.isHomePossession ? (
          <div className="text-left bg-gray-900 text-gray-500">
            {rally.serveEvent.player === undefined ? (
              <></>
            ) : (
              <p className="pl-2 text-md font-semibold">
                {rally.serveEvent.player.firstName} {rally.serveEvent.player.lastName.toUpperCase()}
              </p>
            )}
          </div>
        ) : (
          <div className="text-right bg-gray-900 text-gray-500">
            {rally.serveEvent.player === undefined ? (
              <></>
            ) : (
              <p className="pr-2 text-md font-semibold">
                {rally.serveEvent.player.firstName} {rally.serveEvent.player.lastName.toUpperCase()}
              </p>
            )}
          </div>
        )}
        <div className="flex justify-between">
          {/* <p className={getEventStringColor(event)}>
            {eventString(event)} {subEventString(event)}{" "}
            {eventGradeString(event)}
          </p> */}
          
          <p className="pr-2 pb-2 text-md">
            ({rally.gameNumber === undefined ? "" : rally.gameNumber}) {rally.homeScore}-{rally.awayScore}
          </p>
        </div>
      </div>
    </div>
  </>;
}

export default RallyItem;
