import { HTMLProps } from "react";

export default function Input(props: HTMLProps<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`${props.className} rounded-md bg-black/5 p-1 shadow-inner shadow-black/10`}
    />
  );
}
