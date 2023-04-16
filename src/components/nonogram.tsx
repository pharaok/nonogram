import Canvas2D from "helpers/canvas";
import { PointerEvent, useEffect, useRef } from "react";
import useNonogramStore, { selectClues } from "store";

export default function Nonogram() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = useRef<Canvas2D | null>(null);
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

    for (let i = clueHeight; i <= totalHeight; i++) {
      canvas.current!.drawLine(
        [
          [-Infinity, i],
          [Infinity, i],
        ],
        1,
        "black"
      );
    }
    for (let i = clueWidth; i <= totalWidth; i++) {
      canvas.current!.drawLine(
        [
          [i, -Infinity],
          [i, Infinity],
        ],
        1,
        "black"
      );
    }
  };

  useEffect(() => {
    canvas.current = new Canvas2D(
      canvasRef.current!,
      [0, 0, totalWidth, totalHeight],
      [0, 0, 1, 1]
    );

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      canvasRef.current!.width = width;
      canvasRef.current!.height = height;
      draw();
    });
    resizeObserver.observe(canvasRef.current!);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    draw();
  }, [grid]);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      onPointerDown={(e) => {
        paint([eventToCoords(e)], 0);
      }}
    ></canvas>
  );
}
