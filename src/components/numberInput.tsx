import { ChevronDown, ChevronUp } from "lucide-react";
import { Write } from "types";
import Input from "./input";
import Button from "./button";

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
    value: string | number;
    onChange: (value: string) => void;
  }
>) {
  return (
    <div className="flex">
      <Input
        type="number"
        className={`appearance-textfield w-full rounded-r-none ${className}`}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        {...props}
      />
      <div className="flex flex-col justify-evenly rounded-r-md bg-background-alt">
        <Button
          className="!rounded-none !rounded-tr-[inherit]"
          onClick={() => {
            if (Number.isInteger(+value))
              onChange(Math.min(+value + 1, props.max ?? Infinity).toString());
          }}
          tabIndex={-1}
        >
          <ChevronUp size={16} />
        </Button>
        <Button
          className="!rounded-none !rounded-br-[inherit]"
          onClick={() => {
            if (Number.isInteger(+value))
              onChange(Math.max(+value - 1, props.min ?? -Infinity).toString());
          }}
          tabIndex={-1}
        >
          <ChevronDown size={16} />
        </Button>
      </div>
    </div>
  );
}
