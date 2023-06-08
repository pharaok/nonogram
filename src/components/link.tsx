import NextLink, { LinkProps } from "next/link";
import { Write } from "types";

export default function Link({
  variant = "default",
  className,
  ...props
}: Write<React.ComponentPropsWithoutRef<"a">, LinkProps> & {
  variant?: "default" | "cta" | "button";
}) {
  className = `${className}`;
  switch (variant) {
    case "default":
      className = `text-foreground transition hover:text-primary disabled:text-foreground/50 ${className}`;
      break;
    case "cta":
      className = `relative rounded-full transition bg-primary px-6 py-2 text-center font-bold uppercase text-background shadow shadow-black/50 after:absolute after:inset-0 after:rounded-full hover:scale-105 hover:after:bg-white/10 ${className}`;
      break;
    case "button":
      className = `rounded-md bg-primary/10 h-8 flex px-2 items-center justify-center text-lg font-bold text-foreground transition hover:bg-foreground hover:text-background ${className}`;
      break;
  }
  return <NextLink {...props} className={className}></NextLink>;
}
