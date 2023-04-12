import { formatDuration } from "helpers/time";
import { useEffect, useState } from "react";
import BrushToggleGroup from "./brushToggleGroup";

export default function Controls() {
  const [startTime] = useState(Date.now());
  const [currTime, setCurrTime] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrTime(Date.now());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center rounded-xl bg-gray-200 py-4 px-12 shadow-md shadow-black/25">
      <span className="mb-4 text-2xl">
        {formatDuration(currTime - startTime)}
      </span>
      <BrushToggleGroup />
    </div>
  );
}
