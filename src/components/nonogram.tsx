import Canvas2D from "helpers/canvas";
import { clamp } from "lodash-es";
import { PointerEvent, useEffect, useRef } from "react";
import useNonogramStore, { selectClues, selectDimensions } from "store";

export default function Nonogram() {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const canvas = useRef<Canvas2D | null>(null);
  const prevCell = useRef<[number, number]>([0, 0]);
  const painting = useRef(false);

  const grid = useNonogramStore((state) => state.grid);
  const [width, height] = useNonogramStore(selectDimensions);

  const colors = useNonogramStore((state) => state.colors);
  const clues = useNonogramStore(selectClues);
  const [clueWidth, clueHeight] = [
    Math.max(...clues[0].map((c) => c.length)),
    Math.max(...clues[1].map((c) => c.length)),
  ];
  const paint = useNonogramStore((state) => state.paint);
  const [totalWidth, totalHeight] = [width + clueWidth, height + clueHeight];

  const eventToCoords = (
    e: PointerEvent<HTMLCanvasElement>
  ): [number, number] => {
    const [ratioX, ratioY] = canvas.current!.getViewBoxRatio();
    const { top, left } = e.currentTarget.getBoundingClientRect();
    const [cx, cy] = [
      (e.clientX - left - canvas.current!.extra[0]) / ratioX,
      (e.clientY - top - canvas.current!.extra[1]) / ratioY,
    ].map(Math.floor);
    return [cx - clueWidth, cy - clueHeight];
  };

  const drawGridLines = () => {
    for (let a = 0; a < 2; a++) {
      for (
        let i = [clueWidth, clueHeight][a];
        i <= [totalWidth, totalHeight][a];
        i++
      ) {
        const p1: [number, number] = [-Infinity, -Infinity];
        const p2: [number, number] = [Infinity, Infinity];
        p1[a] = i;
        p2[a] = i;
        canvas.current!.drawLine([p1, p2], 1, "black");
      }
    }
  };

  const drawCell = (cell: number, x: number, y: number) => {
    canvas.current!.drawRect(clueWidth + x, clueHeight + y, 1, 1, colors[cell]);
  };

  const draw = () => {
    canvas.current!.clear();
    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        drawCell(cell, x, y);
      });
    });

    const [_, ratioY] = canvas.current!.getViewBoxRatio();
    clues.forEach((gClues, a) => {
      gClues.forEach((ce, i) => {
        ce.forEach((n, j) => {
          canvas.current!.fillText(
            n.length.toString(),
            (a === 1 ? i + clueWidth : j + clueWidth - ce.length) + 0.5,
            (a === 0 ? i + clueHeight : j + clueHeight - ce.length) + 0.5,
            `${ratioY / 2}px sans-serif`,
            "black"
          );
        });
      });
    });

    drawGridLines();
  };

  useEffect(() => {
    canvas.current = new Canvas2D(
      canvasEl.current!,
      [0, 0, totalWidth, totalHeight],
      [0, 0, 1, 1]
    );

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      canvasEl.current!.width = width;
      canvasEl.current!.height = height;
      draw();
    });
    resizeObserver.observe(canvasEl.current!);
    return () => {
      resizeObserver.disconnect();
    };
  }, [totalWidth, totalHeight]);

  useEffect(() => {
    draw();
  }, [grid]);

  return (
    <canvas
      ref={canvasEl}
      className="h-full w-full"
      onPointerDown={(e) => {
        const coords = eventToCoords(e);
        if (coords.some((d) => d < 0)) {
          return;
        }
        e.currentTarget.setPointerCapture(e.pointerId);
        paint([coords], 0);
        prevCell.current = coords;
        painting.current = true;
      }}
      onPointerMove={(e) => {
        if (!painting.current) {
          return;
        }
        const [x, y] = eventToCoords(e).map((d, i) =>
          clamp(d, 0, [width, height][i] - 1)
        ) as [number, number];
        paint([[x, y], prevCell.current]);
        prevCell.current = [x, y];
      }}
      onPointerUp={() => {
        painting.current = false;
      }}
    ></canvas>
  );
}
