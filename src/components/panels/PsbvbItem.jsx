import { useState, useEffect } from "react";

function PsbvbItem({ psbvbFile, onFileSelected }) {
    const [, forceUpdate] = useState(0);

    const doFileSelect = () => {
      psbvbFile.isSelected = !psbvbFile.isSelected
      forceUpdate((n) => !n)
      onFileSelected(psbvbFile);
    };
  
    useEffect(() => {
  
    }, [])
  
    return (
      <div>
        <div className="mb-1 rounded-sm card-compact px-2 bg-base-200 hover:bg-base-300" onClick={() => doFileSelect()}>
          <div className="flex">
            <div className="form-control">
              <label className="label cursor-pointer">
                  <input type="checkbox" checked={psbvbFile.isSelected} className="checkbox" />
              </label>
            </div>
            <div className="text-left">
              <p className="pl-2 pt-2 text-md font-semibold">
                {psbvbFile.teamA} vs {psbvbFile.teamB}
              </p>
              <div className="flex justify-between">
                <p className="pl-2 pb-2 text-sm">{psbvbFile.matchScores}</p>
                <p className="pl-2 pb-2 text-sm">{psbvbFile.matchDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default PsbvbItem