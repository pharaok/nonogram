import Canvas2D from "helpers/canvas";
import { totalmem } from "os";
import { useEffect, useRef } from "react";
import useNonogramStore, { selectClues } from "store";

export default function Nonogram() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = useRef<Canvas2D | null>(null);
  const grid = useNonogramStore((state) => state.grid);
  const clues = useNonogramStore(selectClues);
  const [clueWidth, clueHeight] = [
    Math.max(...clues[0].map((c) => c.length)),
    Math.max(...clues[1].map((c) => c.length)),
  ];
  const [totalWidth, totalHeight] = [
    grid[0].length + clueWidth,
    grid.length + clueHeight,
  ];

  useEffect(() => {
    canvas.current = new Canvas2D(canvasRef.current!, [
      0,
      0,
      totalWidth,
      totalHeight,
    ]);
    draw();

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

  const draw = () => {
    for (let i = 0; i <= totalHeight; i++) {
      canvas.current!.drawLine(
        [
          [0, i],
          [totalWidth, i],
        ],
        1,
        "black"
      );
    }
    for (let i = 0; i <= totalWidth; i++) {
      canvas.current!.drawLine(
        [
          [i, 0],
          [i, totalHeight],
        ],
        1,
        "black"
      );
    }
    // canvas.current!.drawRect(1, 1, 1, 1, "red");
  };
  return <canvas ref={canvasRef} className="h-full w-full"></canvas>;
}
