"use client";

import { setDocumentColor } from "helpers";
import { useEffect } from "react";
import { SettingsContext, SettingsSlice } from "settings";
import { StoreApi, useStore } from "zustand";

export default function SettingsProvider({
  value,
  children,
}: {
  value: StoreApi<SettingsSlice>;
  children?: React.ReactNode;
}) {
  const colors = useStore(value, (state) => state.settings.colors);

  useEffect(() => {
    let color: keyof typeof colors;
    for (color in colors) {
      setDocumentColor(color, colors[color]);
    }
  }, [colors]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
