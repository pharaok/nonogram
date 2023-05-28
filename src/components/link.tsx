import NextLink, { LinkProps } from "next/link";
import { Write } from "types";

export default function Link({
  className,
  ...props
}: Write<React.ComponentPropsWithoutRef<"a">, LinkProps>) {
  className = `text-foreground transition hover:text-primary disabled:text-foreground/50 ${className}`;
  return <NextLink {...props} className={className}></NextLink>;
}
