"use client";

import * as Tabs from "@radix-ui/react-tabs";
import Button from "components/button";
import SettingsProvider from "components/settingsProvider";
import { isEqual } from "lodash-es";
import Link from "next/link";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { useEffect, useState } from "react";
import { settingsSlice, useSettings } from "settings";
import { createStore, useStore } from "zustand";

export default function Settings({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const settings = useSettings((state) => state.settings);
  const setSettings = useSettings((state) => state.set);
  const [settingsDraftStore] = useState(() => {
    const store = createStore(settingsSlice);
    store.setState({ settings });
    return store;
  });
  const settingsDraft = useStore(settingsDraftStore, (state) => state.settings);
  const setSettingsDraft = useStore(settingsDraftStore, (state) => state.set);

  const defaultTab = "controls";
  const tab = useSelectedLayoutSegment();
  useEffect(() => {
    if (tab === null) router.replace(`settings/${defaultTab}`);
  }, [tab, router]);

  return (
    <SettingsProvider value={settingsDraftStore}>
      <main className="relative flex-1">
        <Tabs.Root
          className="absolute inset-0 mx-8 mb-8 flex flex-col md:mx-[20%] lg:mx-[25%]"
          value={tab ?? defaultTab}
          onValueChange={(value) => {
            router.push(`/settings/${value}`);
          }}
        >
          <Tabs.List className="mb-2 flex flex-wrap justify-center gap-4 rounded-t-xl text-xl">
            {["Controls", "Theme"].map((v, i) => (
              <Tabs.Trigger
                key={i}
                value={v.toLowerCase()}
                className="transition hover:text-primary data-[state=active]:text-primary"
              >
                <Link href={`/settings/${v.toLowerCase()}`}>{v}</Link>
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <div className="flex h-full flex-col justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-0 overflow-scroll rounded-xl bg-background-alt p-4 shadow-md shadow-black/25">
                {children}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
              <Button
                variant="error"
                className="md:col-start-3 lg:col-start-5"
                disabled={isEqual(settings, settingsDraft)}
                onClick={() =>
                  setSettingsDraft((draft) => {
                    draft.settings = settings;
                  })
                }
              >
                Reset
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  setSettings((draft) => {
                    draft.settings = settingsDraft;
                  })
                }
              >
                Apply
              </Button>
            </div>
          </div>
        </Tabs.Root>
      </main>
    </SettingsProvider>
  );
}
