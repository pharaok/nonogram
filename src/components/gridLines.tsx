import { Line, Rect } from "helpers/canvas";
import { useCallback } from "react";
import useNonogramStore, { selectClues, selectDimensions } from "store";
import { Point } from "types";
import Canvas from "./canvas";

export default function GridLines() {
  const cursor = useNonogramStore((state) => state.cursor);
  const [width, height] = useNonogramStore(selectDimensions);

  const clues = useNonogramStore(selectClues);
  const [clueWidth, clueHeight] = [
    Math.max(...clues[0].map((c) => c.length)),
    Math.max(...clues[1].map((c) => c.length)),
  ];

  const getLineWidth = useCallback(
    (a: number, i: number) => {
      if (i % 5 === 0) return 2;
      if (i === 0 || i === [width, height][a]) return 2;
      return 1;
    },
    [width, height]
  );

  return (
    <Canvas
      className="pointer-events-none absolute h-full w-full touch-none"
      viewBox={[0, 0, width + clueWidth, height + clueHeight]}
      padding={[0, 0, 1, 1]}
    >
      {(canvas) => {
        canvas.clear();
        for (let a = 0; a < 2; a++) {
          for (let i = 0; i <= [width, height][a]; i++) {
            let points: Point[] = [
              [-Infinity, -Infinity],
              [Infinity, Infinity],
            ];
            points[0][a] = [clueWidth, clueHeight][a] + i;
            points[1][a] = [clueWidth, clueHeight][a] + i;
            if (i === cursor[a] || i === cursor[a] + 1) continue;
            canvas.add(
              new Line({
                points,
                width: getLineWidth(a, i),
                stroke: "rgb(var(--color-foreground))",
              })
            );
          }
        }
        for (let a = 0; a < 2; a++) {
          let p = [0, 0];
          p[a] = [clueWidth, clueHeight][a] + cursor[a];
          const [x, y] = p;
          let d = [1, 1];
          d[+!a] = [clueWidth, clueHeight][+!a] + [width, height][+!a];
          canvas.add(
            new Rect({
              x,
              y,
              width: d[0],
              height: d[1],
              fill: "rgb(var(--color-primary) / 0.15)",
            })
          );
        }
        for (let a = 0; a < 2; a++) {
          for (let i = cursor[a]; i <= cursor[a] + 1; i++) {
            let points: Point[] = [
              [-Infinity, -Infinity],
              [Infinity, Infinity],
            ];
            points[0][a] = [clueWidth, clueHeight][a] + i;
            points[1][a] = [clueWidth, clueHeight][a] + i;
            canvas.add(
              new Line({
                points,
                width: getLineWidth(a, i),
                stroke: "rgb(var(--color-primary))",
              })
            );
          }
        }
        canvas.draw();
      }}
    </Canvas>
  );
}
