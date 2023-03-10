import { useEffect, useState } from "react";
import PsbvbItem from "./PsbvbItem";

function PsbvbList({ psbvbFiles, onSelectFile }) {
    const [, forceUpdate] = useState(0);

    const onFileSelected = (fl) => {
      onSelectFile(fl)
    };
  
    useEffect(() => {
      forceUpdate((n) => !n)
    }, [, psbvbFiles])
  
    return (
        <>
          <div>
            {psbvbFiles &&  psbvbFiles.map((psbvbFile, idx) => (
              <PsbvbItem
                key={idx}
                psbvbFile={psbvbFile}
                onFileSelected={(fl) => onFileSelected(fl)}
              />
            ))}
          </div>
        </>
      );
    }

export default PsbvbList