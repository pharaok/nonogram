import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { crossPath } from "helpers";
import produce from "immer";
import { Eraser } from "lucide-react";
import useNonogramStore from "store";

export default function BrushToggleGroup() {
  const brushes = useNonogramStore((state) => state.brushes);
  const setBrushes = useNonogramStore((state) => state.setBrushes);
  const colors = useNonogramStore((state) => state.colors);
  return (
    <ToggleGroup.Root
      type="multiple"
      className="inline-flex items-stretch whitespace-nowrap rounded-md bg-primary/10"
      value={brushes.map((b) => b.toString())}
    >
      {[...Array(colors.length + 1)].map((_, i) => (
        <ToggleGroup.Item
          aria-label={
            i === 0 ? "Eraser" : i === colors.length ? "Marker" : `Color ${i}`
          }
          key={i}
          value={i.toString()}
          className="inline-flex w-10 items-center justify-center border-2 p-1 first:w-9 first:rounded-l-md last:w-9 last:rounded-r-md"
          style={{
            borderColor:
              brushes[0] === i
                ? "rgb(var(--color-primary))"
                : brushes[1] === i
                ? "rgb(var(--color-secondary))"
                : "transparent",
            backgroundColor: i !== 0 && i < colors.length ? colors[i] : "none",
          }}
          onMouseDown={(e) => {
            if (brushes.includes(i)) {
              // clicked on an already selected brush
              if (brushes[+(e.button === 2)] !== i) {
                setBrushes(
                  produce(brushes, (draft) => {
                    draft[0] = draft.splice(1, 1, draft[0])[0]; // swap
                  })
                );
              }
            } else {
              setBrushes(
                produce(brushes, (draft) => {
                  draft[+(e.button === 2)] = i;
                })
              );
            }
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          {i === 0 ? (
            <Eraser strokeWidth={2} />
          ) : i === colors.length ? (
            <svg viewBox="0 0 1 1" className="inline">
              <path
                d={crossPath(0, 0)}
                stroke="rgb(var(--color-foreground))"
                strokeWidth={0.1}
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <span className="text-foreground invert">{i}</span>
          )}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
