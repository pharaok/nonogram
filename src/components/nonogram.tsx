import Canvas from "components/canvas";
import useNonogramStore, { selectDimensions } from "store";
import { gridClues } from "helpers/clue";

export default function Nonogram() {
  const grid = useNonogramStore((state) => state.grid);
  const [width, height] = useNonogramStore(selectDimensions);
  console.log(gridClues(grid));
  return (
    <div
      className="grid"
      style={{
        gridTemplateRows: `repeat(${height}, 1fr)`,
        gridTemplateColumns: `repeat(${height}, 1fr)`,
      }}
    >
      <div
        style={{
          gridRow: `1 / ${height + 1}`,
          gridColumn: `1 / ${width + 1}`,
        }}
      >
        <Canvas />
      </div>
    </div>
  );
}
