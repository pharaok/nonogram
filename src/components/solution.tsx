import Canvas2D, { drawGrid } from "helpers/canvas";
import { useRef, useEffect, CSSProperties, useState } from "react";
import useNonogramStore, { selectDimensions } from "store";

export default function Solution({
  style,
  className,
}: {
  style?: CSSProperties;
  className?: string;
}) {
  const solution = useNonogramStore((state) => state.solution);
  const colors = useNonogramStore((state) => state.colors);
  const [width, height] = useNonogramStore(selectDimensions);
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const canvas = useRef<Canvas2D | null>(null);
  const [hue, setHue] = useState(Math.floor(Math.random() * 360));

  const draw = () => {
    const grad = canvas.current!.ctx.createLinearGradient(
      0,
      0,
      canvasEl.current!.width,
      canvasEl.current!.height
    );
    grad.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
    grad.addColorStop(1, `hsl(${hue + 60}, 100%, 50%)`);
    drawGrid(canvas.current!, solution, 0, 0, (canvas, cell, x, y) => {
      if (!cell) canvas.drawRect(x, y, 1, 1, colors[0]);
      if (cell === 1) canvas.drawRect(x, y, 1, 1, grad);
    });
  };

  useEffect(() => {
    canvas.current = new Canvas2D(canvasEl.current!, [0, 0, width, height]);

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
  }, [width, height, draw]);

  useEffect(() => {
    draw();
  }, [hue]);

  return (
    <canvas
      ref={canvasEl}
      className={className}
      style={{ ...style, aspectRatio: `${width} / ${height}` }}
    ></canvas>
  );
}
