"use client";
import { useEffect, useRef } from "react";
import { Write } from "types";

export default function Button({
  variant = "secondary",
  touchRepeat = false,
  className,
  onClick,
  disabled,
  ...props
}: Write<
  React.ComponentPropsWithoutRef<"button">,
  {
    touchRepeat?: boolean;
    variant?: "secondary" | "primary" | "error";
    onClick: React.MouseEventHandler<HTMLButtonElement> &
      React.TouchEventHandler<HTMLButtonElement>;
  }
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
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const intervalRef = useRef<NodeJS.Timer | undefined>(undefined);
  useEffect(() => {
    if (disabled) {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
      timeoutRef.current = undefined;
      intervalRef.current = undefined;
    }
  }, [disabled]);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onTouchStart={(e) => {
        timeoutRef.current = setTimeout(() => {
          if (touchRepeat)
            intervalRef.current = setInterval(() => {
              onClick(e);
            }, 50);
        }, 300);
      }}
      onTouchEnd={() => {
        clearTimeout(timeoutRef.current);
        clearInterval(intervalRef.current);
        timeoutRef.current = undefined;
        intervalRef.current = undefined;
      }}
      className={className}
      {...props}
    ></button>
  );
}
