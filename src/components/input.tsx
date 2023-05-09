export default function Input({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"input">) {
  return (
    <input
      {...props}
      className={`${className} rounded-md bg-background-alt p-1`}
    />
  );
}
