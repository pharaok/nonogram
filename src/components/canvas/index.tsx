import { createContext } from "react";
import { Vector4D } from "types";

export const CanvasContext = createContext<{
  viewBox?: Vector4D;
  padding?: Vector4D;
} | null>(null);

export default function Canvas({
  viewBox,
  padding,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  viewBox: Vector4D;
  padding?: Vector4D;
}) {
  return (
    <CanvasContext.Provider value={{ viewBox, padding }}>
      <div className={`relative ${className}`} {...props}></div>
    </CanvasContext.Provider>
  );
}
