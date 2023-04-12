import * as ToggleGroup from "@radix-ui/react-toggle-group";
import produce from "immer";
import { FaEraser } from "react-icons/fa";
import useNonogramStore from "store";

export default function BrushToggleGroup() {
  const brushes = useNonogramStore((state) => state.brushes);
  const setBrushes = useNonogramStore((state) => state.setBrushes);
  const colors = useNonogramStore((state) => state.colors);
  return (
    <ToggleGroup.Root
      type="multiple"
      className="rounded-md bg-white"
      value={brushes.map((b) => b.toString())}
    >
      {[...Array(colors + 1)].map((_, i) => (
        <ToggleGroup.Item
          key={i}
          value={i.toString()}
          className="h-full w-8 border p-1 first:rounded-l-md last:rounded-r-md"
          style={{
            borderColor:
              brushes[0] === i
                ? "red"
                : brushes[1] === i
                ? "blue"
                : "transparent",
          }}
          onMouseDown={(e) => {
            if (brushes.includes(i)) {
              // clicked on an already selected brush
              setBrushes(
                produce(brushes, (draft) => {
                  draft[0] = draft.splice(1, 1, draft[0])[0]; // swap
                })
              );
            } else {
              setBrushes(
                produce(brushes, (draft) => {
                  if (e.button === 0) {
                    draft[0] = i;
                  } else if (e.button === 2) {
                    draft[1] = i;
                  }
                })
              );
            }
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          {i || <FaEraser className="inline" />}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
