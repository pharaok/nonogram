import { Line, Rect } from "helpers/canvas";
import { useCallback } from "react";
import useNonogramStore, { selectDimensions } from "store";
import { Point } from "types";
import Canvas from "./canvas";

export default function GridLines({
  style,
  x = 0,
  y = 0,
}: {
style: React.CSSProperties; 
  x?: number;
  y?: number;
}) {
  const cursor = useNonogramStore((state) => state.cursor);
  const [width, height] = useNonogramStore(selectDimensions);

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
      className="pointer-events-none absolute touch-none"
      style={style}
      viewBox={[-x, -y, height, width]}
      padding={[0, 0, 1, 1]}
    >
      {(canvas) => {
        for (let a = 0; a < 2; a++) {
          for (let i = 0; i <= [width, height][a]; i++) {
            let points: Point[] = [
              [-Infinity, -Infinity],
              [Infinity, Infinity],
            ];
            points[0][a] = i;
            points[1][a] = i;
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
          let p = [-Infinity, -Infinity];
          p[a] = cursor[a];
          const [x, y] = p;
          let d = [Infinity, Infinity];
          d[a] = 1;
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
            points[0][a] = i;
            points[1][a] = i;
            canvas.add(
              new Line({
                points,
                width: getLineWidth(a, i),
                stroke: "rgb(var(--color-primary))",
              })
            );
          }
        }
      }}
    </Canvas>
  );
}
