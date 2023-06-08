import { Lock, Unlock } from "lucide-react";
import Button from "./button";
import NumberInput from "./numberInput";
import { useState } from "react";

export default function SizeInput({
  width,
  height,
  onWidthChange,
  onHeightChange,
}: {
  width: number;
  height: number;
  onWidthChange: (v: number) => any;
  onHeightChange: (v: number) => any;
}) {
  const [locked, setLocked] = useState(true);

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
      <div>
        <label htmlFor="width">width</label>
        <NumberInput
          name="width"
          value={width}
          onChange={(v) => {
            onWidthChange(v);
            if (locked) onHeightChange(v);
          }}
          min={1}
          max={50}
        />
      </div>
      <Button
        className={`flex h-8 w-8 items-center justify-center ${
          locked ? "!bg-primary !text-background hover:!bg-foreground" : ""
        }`}
        onClick={() => setLocked((l) => !l)}
      >
        {locked ? <Lock /> : <Unlock />}
      </Button>
      <div>
        <label htmlFor="height">height</label>
        <NumberInput
          name="height"
          value={height}
          onChange={(v) => {
            onHeightChange(v);
            if (locked) onWidthChange(v);
          }}
          min={1}
          max={50}
        />
      </div>
    </div>
  );
}
