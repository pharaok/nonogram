import { formatDuration } from "helpers/time";
import { useEffect, useRef, useState } from "react";
import useNonogramStore, { selectIsSolved } from "store";
import BrushToggleGroup from "./brushToggleGroup";
import Button from "./button";
import { Redo2, Undo2 } from "lucide-react";

export default function Controls() {
  const solution = useNonogramStore((state) => state.solution);
  const isSolved = useNonogramStore(selectIsSolved);
  const undo = useNonogramStore((state) => state.undo);
  const redo = useNonogramStore((state) => state.redo);
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
    <div className="flex flex-col items-center gap-2 rounded-xl bg-background-alt py-4 px-12 shadow-md shadow-black/25">
      <span className="text-2xl">
        {formatDuration(Math.max(0, currTime - startTime))}
      </span>
      <div className="flex gap-2">
        <Button
          className="group flex h-8 w-8 justify-center rounded-md bg-background"
          onClick={() => undo()}
        >
          <Undo2 className="text-foreground group-hover:text-primary" />
        </Button>
        <Button
          className="group flex h-8 w-8 justify-center rounded-md bg-background"
          onClick={() => redo()}
        >
          <Redo2 className="text-foreground group-hover:text-primary" />
        </Button>
      </div>
      <BrushToggleGroup />
    </div>
  );
}
