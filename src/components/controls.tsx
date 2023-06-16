import { formatDuration } from "helpers/time";
import { useEffect, useRef, useState } from "react";
import useNonogramStore, { selectIsSolved } from "store";
import BrushToggleGroup from "./brushToggleGroup";
import Button from "./button";
import { Redo2, RotateCcw, Undo2 } from "lucide-react";
import { selectCanRedo, selectCanUndo } from "history";
import Panel from "./panel";

export default function Controls() {
  const solution = useNonogramStore((state) => state.solution);
  const isSolved = useNonogramStore(selectIsSolved);
  const clear = useNonogramStore((state) => state.clear);
  const undo = useNonogramStore((state) => state.undo);
  const redo = useNonogramStore((state) => state.redo);
  const canUndo = useNonogramStore(selectCanUndo);
  const canRedo = useNonogramStore(selectCanRedo);
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
    <Panel className="flex flex-col items-center gap-2">
      <span className="text-2xl">
        {formatDuration(Math.max(0, currTime - startTime))}
      </span>
      <div className="flex gap-2">
        <Button
          className="flex h-8 w-8 items-center justify-center"
          onClick={() => clear()}
        >
          <RotateCcw />
        </Button>
        <Button
          className="flex h-8 w-8 items-center justify-center"
          onClick={() => undo()}
          disabled={!canUndo}
          touchRepeat
        >
          <Undo2 />
        </Button>
        <Button
          className="flex h-8 w-8 items-center justify-center"
          onClick={() => redo()}
          disabled={!canRedo}
          touchRepeat
        >
          <Redo2 />
        </Button>
      </div>
      <BrushToggleGroup />
    </Panel>
  );
}
