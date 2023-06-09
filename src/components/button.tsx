import { Write } from "types";

export default function Button({
  className,
  variant = "secondary",
  ...props
}: Write<
  React.ComponentPropsWithoutRef<"button">,
  { variant?: "secondary" | "primary" | "error" }
>) {
  className = `box-border rounded-md text-lg font-bold transition disabled:cursor-not-allowed enabled:hover:text-background ${className}`;
  switch (variant) {
    case "secondary":
      className = `enabled:hover:bg-foreground disabled:text-foreground/50 bg-primary/10 text-foreground ${className}`;
      break;
    case "primary":
      className = `bg-primary text-background disabled:bg-background border-2 border-primary disabled:text-primary enabled:hover:border-foreground enabled:hover:bg-foreground ${className}`;
      break;
    case "error":
      className = `bg-background border-2 border-error text-error disabled:text-error/50 disabled:border-error/50 enabled:hover:bg-error ${className}`;
  }
  return <button {...props} className={className}></button>;
}
