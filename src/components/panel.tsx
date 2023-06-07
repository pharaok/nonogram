export default function Panel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={`rounded-xl bg-background-alt py-4 px-8 shadow-md shadow-black/25 ${className}`}
      {...props}
    ></div>
  );
}
