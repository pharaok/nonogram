import { ChevronDown, ChevronUp } from "lucide-react";
import { Overwrite } from "types";
import Input from "./input";

export default function NumberInput({
  className,
  value,
  onChange,
  ...props
}: Overwrite<
  React.ComponentPropsWithoutRef<"input">,
  {
    value: number;
    onChange: (value: number) => void;
  }
>) {
  return (
    <div className="flex">
      <Input
        type="number"
        className={`appearance-textfield w-full rounded-r-none ${className}`}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        {...props}
      />
      <div className="flex flex-col justify-evenly rounded-r-md bg-background-alt">
        <button
          className="rounded-tr-[inherit]"
          onClick={() => onChange(value + 1)}
        >
          <ChevronUp size={16} />
        </button>
        <button
          className="rounded-br-[inherit]"
          onClick={() => onChange(value - 1)}
        >
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
}
