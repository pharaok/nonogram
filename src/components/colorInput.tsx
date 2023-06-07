import { isColor, toHex } from "helpers";
import { Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Write } from "types";
import Button from "./button";
import Input from "./input";

export default function ColorInput({
  value,
  onChange,
  className,
  ...props
}: Write<
  React.ComponentPropsWithoutRef<"input">,
  {
    value: string;
    onChange: (value: string) => void;
  }
>) {
  const [color, setColor] = useState(value);
  const colorPickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setColor(value);
  }, [value]);
  return (
    <div className={`f-full flex ${className}`}>
      <Input
        {...props}
        type="text"
        value={color}
        onChange={(e) => {
          setColor(e.target.value);
        }}
        onBlur={() => {
          if (isColor(color)) onChange(color);
        }}
        className="mr-px w-full rounded-r-none"
      />
      <Button
        onClick={() => {
          colorPickerRef.current?.click();
        }}
        className="rounded-l-none px-1"
        style={{ backgroundColor: toHex(color) }}
      >
        <Palette size={24} color={toHex(color)} className="invert" />
      </Button>
      <Input
        ref={colorPickerRef}
        {...props}
        type="color"
        value={toHex(color)}
        onChange={(e) => {
          setColor(e.target.value);
          onChange(e.target.value);
        }}
        className="hidden"
      />
    </div>
  );
}
