"use client";

import { setDocumentColor } from "helpers";
import { useEffect } from "react";
import { useSettings } from "settings";

export function ThemeSetter() {
  const colors = useSettings((state) => state.settings.colors);

  useEffect(() => {
    let color: keyof typeof colors;
    for (color in colors) {
      setDocumentColor(color, colors[color]);
    }
  }, [colors]);
  return null;
}
