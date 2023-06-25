import Canvas2D from "helpers/canvas";
import { clamp, isEqual } from "lodash-es";
import { createContext, useCallback, useRef, useState } from "react";
import { Point, Vector4D, Write } from "types";
import Layer from "./layer";

export const CanvasContext = createContext<{
  viewBox?: Vector4D;
  padding?: Vector4D;
} | null>(null);

export default function Canvas({
  disablePanZoom,
  viewBox,
  padding,
  className,
  children,
  ...props
}: Write<
  React.ComponentPropsWithoutRef<"div">,
  {
    disablePanZoom?: boolean;
    viewBox: Vector4D;
    padding?: Vector4D;
  }
>) {
  const [scale, setScale] = useState(1);
  const [offset, _setOffset] = useState([0, 0]);
  const prevPan = useRef([0, 0]);
  const panStart = useRef([0, 0]);
  const canvas = useRef<Canvas2D | null>(null);

  const [x1, y1, x2, y2] = viewBox;
  const [width, height] = [x2 - x1, y2 - y1];

  const setOffset = useCallback(
    (o: number[], nextScale?: number) => {
      const s = nextScale ?? scale;
      const newOffset: Point = [
        clamp(o[0], 0, width - width / s),
        clamp(o[1], 0, height - height / s),
      ];
      if (!isEqual(newOffset, offset)) _setOffset(newOffset);
    },
    [scale, offset, _setOffset]
  );

  return (
    <CanvasContext.Provider
      value={{
        viewBox: [
          x1 + offset[0],
          y1 + offset[1],
          x1 + offset[0] + width / scale,
          y1 + offset[1] + height / scale,
        ],
        padding,
      }}
    >
      <div
        className={`relative ${className}`}
        {...(!disablePanZoom && {
          onMouseDown: (e) => {
            if (e.button === 1) {
              prevPan.current = offset;
              panStart.current = canvas
                .current!.toViewBox(e.clientX, e.clientY)
                .map((v, i) => v - offset[i]);
            }
          },
          onMouseMove: (e) => {
            if (e.buttons === 4) {
              setOffset(
                offset.map(
                  (v, i) =>
                    prevPan.current[i] +
                    (panStart.current[i] -
                      canvas.current!.toViewBox(e.clientX, e.clientY)[i] +
                      v)
                )
              );
            }
          },
          onWheel: (e) => {
            let dZoom = 1 - e.deltaY / 1000;
            const nextScale = clamp(scale * dZoom, 1, 1000);
            const actualDZoom = nextScale / scale;

            let [oldX, oldY] = canvas.current!.toViewBox(e.clientX, e.clientY);
            oldX -= x1 + offset[0];
            oldY -= y1 + offset[1];

            setScale(nextScale);
            setOffset(
              [
                offset[0] + oldX - oldX / actualDZoom,
                offset[1] + oldY - oldY / actualDZoom,
              ],
              nextScale
            );
          },
        })}
        {...props}
      >
        <Layer ref={canvas}></Layer>
        {children}
      </div>
    </CanvasContext.Provider>
  );
}
