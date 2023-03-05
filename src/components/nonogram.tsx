import Canvas from "components/canvas";
import useNonogramStore from "store";

export default function Nonogram() {
  const [width, height] = useNonogramStore((state) => [
    state.grid[0].length,
    state.grid.length,
  ]);
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
