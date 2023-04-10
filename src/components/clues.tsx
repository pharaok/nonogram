import type { Property } from "csstype";
import useNonogramStore, { selectClues } from "store";
import Clue from "./clue";

export default function Clues({
  direction,
}: {
  direction: Property.FlexDirection;
}) {
  if (!direction) {
    direction = "row";
  }
  const isRow = direction.includes("row");
  const clues = useNonogramStore(selectClues);

  return (
    <div
      className="flex h-full w-full"
      style={{ flexDirection: isRow ? "column" : "row" }}
    >
      {clues[+!isRow].map((clue, i) => (
        <Clue key={i} direction={direction} clue={clue} />
      ))}
    </div>
  );
}
