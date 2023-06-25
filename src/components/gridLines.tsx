import Canvas2D, { Line, Rect } from "helpers/canvas";
import { useCallback } from "react";
import { Point, Write } from "types";
import Layer, { CanvasProps } from "./canvas/layer";

export default function GridLines({
  x = 0,
  y = 0,
  width,
  height,
  cursor,
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

  const drawGridLines = useCallback(
    (canvas: Canvas2D) => {
      for (let a = 0; a < 2; a++) {
        for (let i = 0; i <= [width, height][a]; i++) {
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
              stroke: "rgb(var(--color-foreground))",
            })
          );
        }
      }
    },
    [x, y, width, height]
  );

  return (
    <>
      <Layer className="pointer-events-none touch-none" {...props}>
        {drawGridLines}
      </Layer>
      {cursor && (
        <Layer className="pointer-events-none touch-none" {...props}>
          {(canvas) => {
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
        </Layer>
      )}
    </>
  );
}
