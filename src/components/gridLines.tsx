import { Line, Rect } from "helpers/canvas";
import { useCallback } from "react";
import { Point, Write } from "types";
import Canvas, { CanvasProps } from "./canvas";

export default function GridLines({
  x = 0,
  y = 0,
  width,
  height,
  cursor,
  padding = [1, 1, 1, 1],
  ...props
}: Write<
  Omit<CanvasProps, "viewBox" | "children">,
  {
    x?: number;
    y?: number;
    width: number;
    height: number;
    cursor?: Point;
  }
>) {
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
      viewBox={[-x, -y, width, height]}
      padding={padding}
      {...props}
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
            if (cursor && (i === cursor[a] || i === cursor[a] + 1)) continue;
            canvas.add(
              new Line({
                points,
                width: getLineWidth(a, i),
                stroke: "rgb(var(--color-foreground))",
              })
            );
          }
        }
        if (cursor) {
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
        }
      }}
    </Canvas>
  );
}
