export default function Panel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={`rounded-xl bg-background-alt px-8 py-4 shadow-md shadow-black/25 ${className}`}
      {...props}
    ></div>
  );
}
