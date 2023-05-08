"use client";

import { useEffect } from "react";
import { useSettings } from "settings";

export function ThemeSetter() {
  const colors = useSettings((state) => state.colors);

  useEffect(() => {
    let color: keyof typeof colors;
    for (color in colors) {
      (document.querySelector(":root") as HTMLElement).style.setProperty(
        `--color-${color}`,
        colors[color]
      );
    }
  }, [colors]);
  return null;
}
