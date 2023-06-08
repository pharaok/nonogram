import { ChevronDown, ChevronUp } from "lucide-react";
import { Write } from "types";
import Input from "./input";
import Button from "./button";
import { useEffect, useState } from "react";
import { clamp } from "lodash-es";

export default function NumberInput({
  className,
  value,
  onChange,
  ...props
}: Write<
  React.ComponentPropsWithoutRef<"input">,
  {
    min?: number;
    max?: number;
    value: number;
    onChange: (value: number) => void;
  }
>) {
  const [strValue, setStrValue] = useState(value.toString());
  useEffect(() => {
    setStrValue(value.toString());
  }, [value]);

  return (
    <div className={`flex rounded-md ${className}`}>
      <Input
        type="number"
        className="appearance-textfield w-full rounded-r-none bg-inherit"
        value={strValue}
        onChange={(e) => {
          if (Number.isInteger(+e.target.value)) onChange(+e.target.value);
          else setStrValue(e.target.value);
        }}
        {...props}
      />
      <div className="flex flex-col justify-evenly rounded-r-[inherit] bg-inherit">
        <Button
          className="!rounded-none !rounded-tr-[inherit]"
          onClick={() => {
            if (Number.isInteger(+value)) {
              onChange(
                clamp(+value + 1, props.min ?? -Infinity, props.max ?? Infinity)
              );
            }
          }}
          tabIndex={-1}
        >
          <ChevronUp size={16} />
        </Button>
        <Button
          className="!rounded-none !rounded-br-[inherit]"
          onClick={() => {
            if (Number.isInteger(+value))
              onChange(
                clamp(+value - 1, props.min ?? -Infinity, props.max ?? Infinity)
              );
          }}
          tabIndex={-1}
        >
          <ChevronDown size={16} />
        </Button>
      </div>
    </div>
  );
}
