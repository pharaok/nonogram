import Canvas2D from "helpers/canvas";
import { useEffect, useRef } from "react";
import useNonogramStore from "store";

export default function Nonogram() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = useRef<Canvas2D | null>(null);
  const grid = useNonogramStore((state) => state.grid);

  useEffect(() => {
    canvas.current = new Canvas2D(canvasRef.current!, [
      0,
      0,
      grid[0].length,
      grid.length,
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
    canvas.current!.drawRect(1, 1, 1, 1, "red");
  };
  return <canvas ref={canvasRef} className="h-full w-full"></canvas>;
}
