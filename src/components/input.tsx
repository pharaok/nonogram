import { forwardRef } from "react";

const Input = forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithRef<"input">
>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className={`rounded-md bg-primary/10 p-1 ${className}`}
    />
  );
});
export default Input;
