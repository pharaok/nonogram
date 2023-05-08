"use client";
import * as Tabs from "@radix-ui/react-tabs";
import { useSettings } from "settings";

export default function Settings() {
  return (
    <main>
      <Tabs.Root defaultValue="controls" className="mx-64">
        <Tabs.List className="flex flex-wrap justify-center gap-4 text-xl">
          {["Controls", "Theme"].map((v, i) => (
            <Tabs.Trigger
              key={i}
              value={v.toLowerCase()}
              className="data-[state=active]:text-primary"
            >
              {v}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <Tabs.Content value="controls">Controls</Tabs.Content>
        <Tabs.Content value="theme">Theme</Tabs.Content>
      </Tabs.Root>
    </main>
  );
}
