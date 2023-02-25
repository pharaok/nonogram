import { gridToPath } from "helpers/path";

export default ({ grid }: { grid: Array<Array<number>> }) => {
  const width = grid[0].length;
  const height = grid.length;
  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <path d={gridToPath(grid)} />
    </svg>
  );
};
