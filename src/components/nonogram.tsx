import Canvas2D from "helpers/canvas";
import { PointerEvent, useEffect, useRef } from "react";
import useNonogramStore, { selectClues } from "store";

export default function Nonogram() {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const canvas = useRef<Canvas2D | null>(null);
  const prevCell = useRef<[number, number]>([0, 0]);
  const grid = useNonogramStore((state) => state.grid);
  const paint = useNonogramStore((state) => state.paint);
  const colors = useNonogramStore((state) => state.colors);
  const clues = useNonogramStore(selectClues);
  const [clueWidth, clueHeight] = [
    Math.max(...clues[0].map((c) => c.length)),
    Math.max(...clues[1].map((c) => c.length)),
  ];
  const [totalWidth, totalHeight] = [
    grid[0].length + clueWidth,
    grid.length + clueHeight,
  ];

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

  const draw = () => {
    canvas.current!.clear();
    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        canvas.current!.drawRect(
          clueWidth + x,
          clueHeight + y,
          1,
          1,
          colors[cell]
        );
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
        paint([coords], 0);
        prevCell.current = coords;
      }}
      onPointerMove={(e) => {
        if (!e.buttons) {
          return;
        }
        const coords = eventToCoords(e);
        paint([coords, prevCell.current]);
        prevCell.current = coords;
      }}
    ></canvas>
  );
}
