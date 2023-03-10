import { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { initWithZippedBuffer } from "../components/utils/psbvbFile";
import PsbvbList from "../components/panels/PsbvbList";
import BVBStatsContext from "../context/BVBStatsContext";
import { storeMatch } from "../context/BVBStatsAction";

function Import() {
  const { match, dispatch } = useContext(BVBStatsContext);
  const navigate = useNavigate();
  const [psbvbFiles, setPsbvbFiles] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null)
  const [, forceUpdate] = useState(0);
  const psbvbRef = useRef();

  const doImport = async () => {
    if (selectedFile === null)
    {
        toast.error("Please select a file to import")
        return
    }
    dispatch({ type: 'SET_LOADING' })
    const m = initWithZippedBuffer(selectedFile.buffer)
    var matchInfo = getMatchInfo(m)
    matchInfo.psbvbFile = selectedFile.buffer
    var ret = await storeMatch(JSON.stringify(matchInfo))
    dispatch({ type: 'POST_MATCH', payload: ret })
  };

  const getMatchInfo = (match) =>
  {
    var matchInfo = {
        guid:match.guid,
        matchDate:match.trainingDate,
        matchDescription:match.teamA.name + " vs " + match.teamB.name,
        matchScore:match.homeScore + "-" + match.awayScore,
        tournament:match.tournament.name === undefined ? "" : match.tournament.name,
        venue:match.venue.name === undefined ? "" : match.venue.name,
        videoOffset:match.videoOffset,
        videoStartTime:match.videoStartTime === undefined ? new Date('01-01-1970') : match.videoStartTime,
        coder:match.coder === undefined ? "" : match.coder,
        games:[],
        teamA:{
            guid:match.teamA.guid,
            name:match.teamA.name,
            code:match.teamA.code,
            countryCode:match.teamA.name.substring(0, 3),
            players:[],
        },
        teamB:{
            guid:match.teamB.guid,
            name:match.teamB.name,
            code:match.teamB.code,
            countryCode:match.teamB.name.substring(0, 3),
            players:[],
        }
    }
    for (const pl of match.teamA.players)
    {
        matchInfo.teamA.players.push({
            guid:pl.guid,
            firstName:pl.firstName,
            lastName:pl.lastName,
            nickName:pl.nickName,
            countryCode:matchInfo.teamA.countryCode,
            positionString:pl.positionString === undefined ? "" : pl.positionString,
            gender:pl.gender === undefined ? "" : pl.gender,
            dob:pl.dOB === undefined ? "1970-01-01T00:00:00.000Z" : pl.dOB,
            fivbId:pl.fivbId === undefined ? "" : pl.fivbId,
        })
    }
    for (const pl of match.teamB.players)
    {
        matchInfo.teamB.players.push({
            guid:pl.guid,
            firstName:pl.firstName,
            lastName:pl.lastName,
            nickName:pl.nickName,
            countryCode:matchInfo.teamB.countryCode,
            positionString:pl.positionString === undefined ? "" : pl.positionString,
            gender:pl.gender === undefined ? "" : pl.gender,
            dob:pl.dOB === undefined ? "1970-01-01T00:00:00.000Z" : pl.dOB,
            fivbId:pl.fivbId === undefined ? "" : pl.fivbId,
        })
    }
    for (const game of match.games)
    {
        matchInfo.games.push({
            gameNumber:game.gameNumber,
            awayScore:game.awayScore,
            homeScore:game.homeScore,
            numberOfEvents:game.events.length,
            startingLineup:game.startingLineup === undefined ? "" : game.startingLineup,
        })
    }
    return matchInfo
  }
  const handlePsbvbFileSelected = (e) => {
    const files = Array.from(e.target.files);
    var mobjs = [];
    for (var nf = 0; nf < files.length; nf++) {
      const fileReader = new FileReader();
      fileReader.readAsText(files[nf], "UTF-8");
      fileReader.onload = (e) => {
        const m = initWithZippedBuffer(e.target.result);
        const mobj = {
          teamA: m.teamA.name,
          teamB: m.teamB.name,
          matchDate: m.trainingDate,
          matchScores: m.homeScore + "-" + m.awayScore,
          buffer: e.target.result,
          isSelected: true,
        };
        mobjs.push(mobj);
        if (mobjs.length === files.length) {
          setPsbvbFiles(mobjs);
          localStorage.setItem("PsbvbFiles", JSON.stringify(mobjs));
          forceUpdate((n) => !n);
        }
      };
    }
  };

  const doClearAll = () => {
    setPsbvbFiles([]);
    localStorage.setItem("PsbvbFiles", JSON.stringify([]));
    forceUpdate((n) => !n);
  };

  const doSelectFile = (fl) => {
    setSelectedFile(fl)
  };

  return (
    <>
      <div className="mx-4 my-10 w-100 h-full">
        <p>SELECT PSBVB FILES</p>
        <div>
          <div className="flex my-4">
            <input
              type="file"
              id="selectedPSBVBFiles"
              ref={psbvbRef}
              style={{ display: "none" }}
              onChange={handlePsbvbFileSelected}
              onClick={(event) => {
                event.target.value = null;
              }}
              multiple
            />
            <input
              type="button"
              className="btn btn-sm w-60"
              value="Select PSBVB files..."
              onClick={() =>
                document.getElementById("selectedPSBVBFiles").click()
              }
            />
            <label className="label ml-4">
              <span className="label-text">
                {psbvbFiles === null || psbvbFiles.length === 0
                  ? "Please select PSBVB files to import"
                  : psbvbFiles.length + " PSBVB files selected"}
              </span>
            </label>
            <button
              className="btn btn-sm bg-gray-600 ml-4"
              onClick={() => doClearAll(true)}
            >
              Clear All
            </button>
          </div>
        </div>
        {/* <div className="flex gap-2 mb-2">
          <button
            className="btn btn-sm bg-gray-600"
            onClick={() => doSelectAll(true)}
          >
            Select All
          </button>
          <button
            className="btn btn-sm bg-gray-600"
            onClick={() => doSelectAll(false)}
          >
            Select None
          </button>
        </div>
        <div className="h-80 overflow-y-auto">
          <VSSList
            vssPackages={vssPackages}
            onSelectPackage={(pkg) => doSelectPackage(pkg)}
          />
        </div> */}

        <div className="h-80 overflow-y-auto">
          <PsbvbList
            psbvbFiles={psbvbFiles}
            onSelectFile={(fl) => doSelectFile(fl)}
          />
        </div>

        <div className="flex space-x-4 mt-2">
          <button
            className="flex btn btn-md btn-primary w-60 my-4"
            onClick={() => doImport()}
          >
            Import
          </button>
        </div>
      </div>
    </>
  );
}

export default Import;
