export default function Button({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  className = `rounded-md text-lg font-bold text-foreground transition hover:text-primary disabled:text-foreground/50 disabled:cursor-not-allowed ${className}`;
  return <button {...props} className={className}></button>;
}
