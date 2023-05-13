import { formatDuration } from "helpers/time";
import { useEffect, useRef, useState } from "react";
import useNonogramStore, { selectIsSolved } from "store";
import BrushToggleGroup from "./brushToggleGroup";

export default function Controls() {
  const solution = useNonogramStore((state) => state.solution);
  const isSolved = useNonogramStore(selectIsSolved);
  const [startTime, setStartTime] = useState(Date.now());
  const [currTime, setCurrTime] = useState(Date.now());
  const interval = useRef<NodeJS.Timer | null>(null);
  useEffect(() => {
    setStartTime(Date.now());
    interval.current = setInterval(() => {
      setCurrTime(Date.now());
    }, 1000);
    return () => {
      clearInterval(interval.current!);
    };
  }, [solution]);
  useEffect(() => {
    if (isSolved) {
      clearInterval(interval.current!);
    }
  });

  return (
    <div className="flex flex-col items-center rounded-xl bg-background-alt py-4 px-12 shadow-md shadow-black/25">
      <span className="mb-4 text-2xl">
        {formatDuration(Math.max(0, currTime - startTime))}
      </span>
      <BrushToggleGroup />
    </div>
  );
}
