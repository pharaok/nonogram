import Canvas2D, { Rect } from "helpers/canvas";
import { forwardRef, useState } from "react";
import useNonogramStore, { selectDimensions } from "store";
import Layer from "./canvas/layer";
import Canvas from "./canvas";
import { Write } from "types";

const Solution = forwardRef<
  Canvas2D | null,
  Write<
    React.ComponentPropsWithoutRef<"div">,
    { onImageURLChange: (url: string) => void }
  >
>(function Solution({ onImageURLChange, style, ...props }, ref) {
  const solution = useNonogramStore((state) => state.solution);
  const colors = useNonogramStore((state) => state.colors);
  const [hue] = useState(Math.floor(Math.random() * 360));
  const [width, height] = useNonogramStore(selectDimensions);

  return (
    <Canvas
      viewBox={[0, 0, width, height]}
      style={{ aspectRatio: `${width} / ${height}`, ...style }}
      disablePanZoom
      {...props}
    >
      <Layer ref={ref}>
        {(canvas) => {
          const grad = canvas.ctx.createLinearGradient(
            0,
            0,
            canvas.ctx.canvas.width,
            canvas.ctx.canvas.height
          );
          grad.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
          grad.addColorStop(1, `hsl(${hue + 60}, 100%, 50%)`);
          solution.forEach((row, y) => {
            row.forEach((cell, x) => {
              if (cell === 0)
                canvas.add(
                  new Rect({ x, y, width: 1, height: 1, fill: colors[0] })
                );
              else if (cell === 1)
                canvas.add(new Rect({ x, y, width: 1, height: 1, fill: grad }));
            });
          });
          onImageURLChange(canvas.ctx.canvas.toDataURL("image/png"));
        }}
      </Layer>
    </Canvas>
  );
});

export default Solution;
