import { Write } from "types";

export default function Button({
  className,
  variant = "secondary",
  ...props
}: Write<
  React.ComponentPropsWithoutRef<"button">,
  { variant?: "secondary" | "primary" }
>) {
  return (
    <button
      {...props}
      className={`rounded-md ${
        variant === "primary"
          ? "bg-primary text-background"
          : "bg-primary/10 text-foreground"
      } text-lg font-bold transition enabled:hover:bg-foreground enabled:hover:text-background disabled:cursor-not-allowed disabled:text-foreground/50 ${className}`}
    ></button>
  );
}
