"use client";

import * as Tabs from "@radix-ui/react-tabs";
import Button from "components/button";
import { setDocumentColor } from "helpers";
import { isEqual } from "lodash-es";
import {
  usePathname,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation";
import { useEffect, useState } from "react";
import { createSettingsStore, SettingsContext, useSettings } from "settings";
import { EntriesOf } from "types";
import { useStore } from "zustand";

export default function Settings({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const settings = useSettings((state) => state.settings);
  const setSettings = useSettings((state) => state.set);
  const [settingsDraftStore] = useState(createSettingsStore());
  const settingsDraft = useStore(settingsDraftStore, (state) => state.settings);
  const setSettingsDraft = useStore(settingsDraftStore, (state) => state.set);

  const defaultTab = "controls";
  const tab = useSelectedLayoutSegment();
  useEffect(() => {
    if (tab === null) router.replace(`${pathname}/${defaultTab}`);
  }, [tab, pathname]);

  useEffect(() => {
    setSettingsDraft((draft) => {
      draft.settings = settings;
    });
  }, []);

  return (
    <SettingsContext.Provider value={settingsDraftStore}>
      <main className="relative flex-1">
        <Tabs.Root
          className="absolute inset-0 mx-8 mb-8 flex flex-col md:mx-[20%] [&_*]:gap-2"
          value={tab ?? defaultTab}
          onValueChange={(value) => {
            router.push(`/settings/${value}`);
          }}
        >
          <Tabs.List className="mb-4 flex flex-wrap justify-center gap-4 text-xl">
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

          <div className="flex h-full flex-col justify-between">
            <div>{children}</div>
            <div className="grid grid-cols-6 justify-self-end">
              <Button
                className="col-start-5 bg-red-400"
                disabled={isEqual(settings, settingsDraft)}
                onClick={() => {
                  (
                    Object.entries(settings.colors) as EntriesOf<
                      typeof settings.colors
                    >
                  ).forEach(([k, v]) => setDocumentColor(k, v));
                  setSettingsDraft((draft) => {
                    draft.settings = settings;
                  });
                }}
              >
                Reset
              </Button>
              <Button
                className="bg-primary hover:bg-secondary"
                onClick={() => {
                  setSettings((draft) => {
                    draft.settings = settingsDraft;
                  });
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </Tabs.Root>
      </main>
    </SettingsContext.Provider>
  );
}
