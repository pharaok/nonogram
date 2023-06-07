import { ChevronDown, ChevronUp } from "lucide-react";
import { Write } from "types";
import Input from "./input";
import Button from "./button";
import { useEffect, useState } from "react";

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
    if (Number.isInteger(+strValue)) onChange(+strValue);
  }, [strValue]);

  return (
    <div className={`flex rounded-md ${className}`}>
      <Input
        type="number"
        className="appearance-textfield w-full rounded-r-none bg-inherit"
        value={strValue}
        onChange={(e) => setStrValue(e.target.value)}
        {...props}
      />
      <div className="flex flex-col justify-evenly rounded-r-[inherit] bg-inherit">
        <Button
          className="!rounded-none !rounded-tr-[inherit]"
          onClick={() => {
            if (Number.isInteger(+value))
              setStrValue(
                Math.min(+value + 1, props.max ?? Infinity).toString()
              );
          }}
          tabIndex={-1}
        >
          <ChevronUp size={16} />
        </Button>
        <Button
          className="!rounded-none !rounded-br-[inherit]"
          onClick={() => {
            if (Number.isInteger(+value))
              setStrValue(
                Math.max(+value - 1, props.min ?? -Infinity).toString()
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
