import React from "react";

function TeamDetail({ team }) {
  if (team.players === undefined) {
    return <></>;
  }
  return (
    <>
      <div className="card w-full mx-4 bg-base-100 shadow-xl">
        {/* <figure>
          <img
            src="/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
            alt="Shoes"
          />
        </figure> */}
        <div className="card-body">
          <div className="flex-col mx-4">
            <div className="flex justify-center gap-6">
              <div className="shadow">
                <img
                  className="shadow w-12 h-12"
                  src={require(`../assets/flags/${team.countryCode}.png`)}
                  alt="Profile"
                />
              </div>
              <p className="mt-1 text-3xl font-bold">
                {team.name.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex gap-6 justify-between mx-6">
            <div className="flex justify-center gap-6 mb-4">
              <div className="shadow">
                <img
                  className="shadow w-8 h-8"
                  src={require(`../assets/flags/${team.countryCode}.png`)}
                  alt="Profile"
                />
              </div>
              <p className="mt-1 text-xl font-bold">
                {team.players[0].firstName.toUpperCase() +
                  " " +
                  team.players[0].lastName.toUpperCase()}
              </p>
            </div>

            <div className="flex justify-center gap-6 mb-4">
              <div className="shadow">
                <img
                  className="shadow w-8 h-8"
                  src={require(`../assets/flags/${team.countryCode}.png`)}
                  alt="Profile"
                />
              </div>
              <p className="mt-1 text-xl font-bold">
                {team.players[1].firstName.toUpperCase() +
                  " " +
                  team.players[1].lastName.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>{" "}
    </>
    // <>
    //   <div className="flex-col w-full">
    //     <div className="flex justify-center gap-6 mb-4">
    //       <div className="shadow">
    //         <img
    //           className="shadow w-12 h-12"
    //           src={require(`../assets/flags/${team.countryCode}.png`)}
    //           alt="Profile"
    //         />
    //       </div>
    //       <p className="mt-1 text-3xl font-bold">{team.name.toUpperCase()}</p>
    //     </div>
    //   </div>

    //   <div className="flex gap-6 justify-between mx-6">
    //     <div className="flex justify-center gap-6 mb-4">
    //       <div className="shadow">
    //         <img
    //           className="shadow w-8 h-8"
    //           src={require(`../assets/flags/${team.countryCode}.png`)}
    //           alt="Profile"
    //         />
    //       </div>
    //       <p className="mt-1 text-xl font-bold">
    //         {team.players[0].firstName.toUpperCase() +
    //           " " +
    //           team.players[0].lastName.toUpperCase()}
    //       </p>
    //     </div>

    //     <div className="flex justify-center gap-6 mb-4">
    //       <div className="shadow">
    //         <img
    //           className="shadow w-8 h-8"
    //           src={require(`../assets/flags/${team.countryCode}.png`)}
    //           alt="Profile"
    //         />
    //       </div>
    //       <p className="mt-1 text-xl font-bold">
    //         {team.players[1].firstName.toUpperCase() +
    //           " " +
    //           team.players[1].lastName.toUpperCase()}
    //       </p>
    //     </div>
    //   </div>
    // </>
  );
}

export default TeamDetail;
