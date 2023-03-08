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
  const oppositeDirection = (
    isRow ? "column" : "row"
  ) as Property.FlexDirection;
  const clues = useNonogramStore(selectClues);
  console.log(clues);
  return (
    <div
      className="flex w-full h-full"
      style={{ flexDirection: oppositeDirection }}
    >
      {clues[+!isRow].map((clue, i) => (
        <Clue key={i} direction={direction} clue={clue} />
      ))}
    </div>
  );
}
