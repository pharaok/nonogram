import { HTMLProps } from "react";

export default function Input(props: HTMLProps<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`${props.className} rounded-md bg-background-alt p-1`}
    />
  );
}
