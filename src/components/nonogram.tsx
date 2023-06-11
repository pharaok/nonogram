import { Text } from "helpers/canvas";
import { useDimensions } from "hooks";
import { useRef } from "react";
import useNonogramStore, { selectClues, selectDimensions } from "store";
import Grid from "./grid";
import GridLines from "./gridLines";
import Canvas from "./canvas";
import Layer from "./canvas/layer";

export default function Nonogram() {
  const nonogramEl = useRef<HTMLDivElement>(null);

  const [width, height] = useNonogramStore(selectDimensions);
  const cursor = useNonogramStore((state) => state.cursor);
  const gridClues = useNonogramStore(selectClues);
  const [clueWidth, clueHeight] = [
    Math.max(...gridClues[0].map((c) => c.length)),
    Math.max(...gridClues[1].map((c) => c.length)),
  ];
  const dimensions = useDimensions(nonogramEl);

  return (
    <div
      ref={nonogramEl}
      className="relative max-h-full max-w-full overflow-hidden outline-none"
      style={{ aspectRatio: `${width + clueWidth} / ${height + clueHeight}` }}
    >
      <Canvas
        viewBox={[-clueWidth, -clueHeight, width, height]}
        padding={[1, 1, 1, 1]}
        style={{ width: dimensions[0], height: dimensions[1] }}
      >
        <Layer>
          {(canvas) => {
            gridClues.forEach((clues, a) => {
              clues.forEach((clue, i) => {
                clue.forEach((n, j) => {
                  const point = [i + 0.5, i + 0.5];
                  point[a] = -(clue.length - j) + 0.5;
                  const [x, y] = point;
                  canvas.add(
                    new Text({
                      x,
                      y,
                      text: n.length.toString(),
                      fontSize: 0.5,
                      fill: n.isMarked
                        ? "rgb(var(--color-foreground) / 0.5)"
                        : "rgb(var(--color-foreground))",
                    })
                  );
                });
              });
            });
          }}
        </Layer>
        <Grid />
        <GridLines
          x={clueWidth}
          y={clueHeight}
          width={width}
          height={height}
          cursor={cursor}
        />
      </Canvas>
      <div className="h-screen w-screen"></div>
    </div>
  );
}
