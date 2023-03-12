import Canvas from "components/canvas";
import useNonogramStore, { selectClues, selectDimensions } from "store";
import Clues from "./clues";

export default function Nonogram() {
  const [width, height] = useNonogramStore(selectDimensions);
  const clues = useNonogramStore(selectClues);
  const [longestRowClue, longestColClue] = Array.from(Array(2)).map((_, i) =>
    Math.max(...clues[i].map((cs) => cs.length))
  );

  const emphasizeBorder = (i: number, l: number) => i % l == 0;

  return (
    <div
      className="grid"
      style={{
        gridTemplateRows: `repeat(${height + longestColClue}, 1fr)`,
        gridTemplateColumns: `repeat(${width + longestRowClue}, 1fr)`,
      }}
    >
      <div
        className="grid"
        style={{
          gridRow: `1 / ${height + longestColClue + 1}`,
          gridColumn: `1 / ${width + longestRowClue + 1}`,
          gridTemplateRows: `repeat(${height + longestColClue}, 1fr)`,
          gridTemplateColumns: `repeat(${width + longestRowClue}, 1fr)`,
        }}
      >
        {Array.from(Array(height + longestColClue)).map((_, i) => (
          <div
            key={i}
            className="border-black"
            style={{
              borderBottomWidth: emphasizeBorder(i, height) ? 2 : 1,
              gridRow: `${i + 1} / ${i + 1}`,
              gridColumn: `1 / ${width + longestRowClue + 1}`,
            }}
          ></div>
        ))}
        {Array.from(Array(width + longestRowClue)).map((_, i) => (
          <div
            key={i}
            className="border-black"
            style={{
              borderRightWidth: emphasizeBorder(i, width) ? 2 : 1,
              gridRow: `1 / ${height + longestColClue + 1}`,
              gridColumn: `${i + 1} / ${i + 1}`,
            }}
          ></div>
        ))}
      </div>
      <div
        style={{
          gridRow: `1 / ${longestColClue + 1}`,
          gridColumn: `${longestRowClue + 1} / ${width + longestRowClue + 1}`,
        }}
      >
        <Clues direction="column" />
      </div>
      <div
        style={{
          gridRow: `${longestColClue + 1} / ${height + longestColClue + 1}`,
          gridColumn: `1 / ${longestRowClue + 1}`,
        }}
      >
        <Clues direction="row" />
      </div>
      <div
        style={{
          gridRow: `${longestColClue + 1} / ${height + longestColClue + 1}`,
          gridColumn: `${longestRowClue + 1} / ${width + longestRowClue + 1}`,
        }}
      >
        <Canvas />
      </div>
    </div>
  );
}
