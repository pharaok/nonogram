import Canvas2D, { Line, Rect } from "helpers/canvas";
import { useParentDimensions } from "hooks";
import { useCallback, useEffect, useRef } from "react";
import useNonogramStore, { selectClues, selectDimensions } from "store";
import { Point } from "types";

export default function GridLines() {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const canvas = useRef<Canvas2D | null>(null);

  const cursor = useNonogramStore((state) => state.cursor);
  const [width, height] = useNonogramStore(selectDimensions);

  const clues = useNonogramStore(selectClues);
  const [clueWidth, clueHeight] = [
    Math.max(...clues[0].map((c) => c.length)),
    Math.max(...clues[1].map((c) => c.length)),
  ];

  const canvasDim = useParentDimensions(canvasEl);

  const getLineWidth = useCallback(
    (a: number, i: number) => {
      if (i % 5 === 0) return 2;
      if (i === 0 || i === [width, height][a]) return 2;
      return 1;
    },
    [width, height]
  );

  useEffect(() => {
    canvas.current = new Canvas2D(
      canvasEl.current!,
      [0, 0, width + clueWidth, height + clueHeight],
      [0, 0, 1, 1]
    );
    for (let a = 0; a < 2; a++) {
      for (let i = 0; i <= [width, height][a]; i++) {
        let points: Point[] = [
          [-Infinity, -Infinity],
          [Infinity, Infinity],
        ];
        points[0][a] = [clueWidth, clueHeight][a] + i;
        points[1][a] = [clueWidth, clueHeight][a] + i;
        if (i === cursor[a] || i === cursor[a] + 1) continue;
        canvas.current.add(
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
      canvas.current.add(
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
        canvas.current.add(
          new Line({
            points,
            width: getLineWidth(a, i),
            stroke: "rgb(var(--color-primary))",
          })
        );
      }
    }
  }, [width, height, clueWidth, clueHeight, cursor, getLineWidth]);

  useEffect(() => {
    canvas.current!.draw();
  }, [canvasDim]);

  return (
    <canvas
      ref={canvasEl}
      className="pointer-events-none absolute h-full w-full touch-none"
      width={canvasDim[0] * (canvas.current?.scale ?? 0)}
      height={canvasDim[1] * (canvas.current?.scale ?? 0)}
      style={{ width: canvasDim[0], height: canvasDim[1] }}
    ></canvas>
  );
}
