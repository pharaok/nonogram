export default function Button({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  return (
    <button
      {...props}
      className={`${className} rounded-md py-1 text-lg font-bold text-white transition disabled:text-white/75`}
    ></button>
  );
}
