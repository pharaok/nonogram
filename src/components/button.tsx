export default function Button({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  return (
    <button
      {...props}
      className={`rounded-md bg-background-alt text-lg font-bold text-foreground transition enabled:hover:bg-foreground enabled:hover:text-background disabled:cursor-not-allowed disabled:text-foreground/50 ${className}`}
    ></button>
  );
}
