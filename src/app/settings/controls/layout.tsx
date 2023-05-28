"use client";

import * as Tabs from "@radix-ui/react-tabs";
import Key from "components/key";
import { Mod } from "hooks";
import { isEqual, startCase } from "lodash-es";
import { Plus, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useSelectedLayoutSegment } from "next/navigation";
import { Fragment, useContext, useEffect } from "react";
import { SettingsContext, Key as KeyT } from "settings";
import { useStore } from "zustand";

export default function Controls({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const searchParams = useSearchParams();
  const settingsDraftStore = useContext(SettingsContext)!;
  const keys = useStore(settingsDraftStore, (state) => state.settings.keys);
  const setSettingsDraft = useStore(settingsDraftStore, (state) => state.set);

  useEffect(() => {
    const k = searchParams.get("k");
    if (segment && Object.keys(keys).includes(segment) && k) {
      const kc = k.split(" ");
      const mods = kc.slice(0, -1) as Mod[];
      const key = kc[kc.length - 1];
      if (keys[segment as KeyT].some((kc) => isEqual(kc, [mods, key]))) return;
      setSettingsDraft((draft) => {
        draft.settings.keys[segment as KeyT].push([mods, key]);
      });
    }
  }, [segment, searchParams]);

  return (
    <Tabs.Content value="controls">
      <div className="grid grid-cols-2 items-center gap-2">
        {(Object.keys(keys) as KeyT[]).map((key, i) => (
          <Fragment key={i}>
            <span>{startCase(key)}</span>
            <div className="flex h-full flex-wrap items-center gap-2 rounded-lg bg-background-alt p-1">
              {keys[key].map((kc, i) => (
                <button
                  key={i}
                  className="group relative flex gap-1 rounded-md bg-secondary p-1 after:absolute after:inset-0 after:rounded-md after:transition hover:after:bg-error"
                  onClick={() => {
                    setSettingsDraft((draft) => {
                      draft.settings.keys[key].splice(i, 1);
                    });
                  }}
                >
                  {kc[0].map((m, j) => (
                    <Key name={m} key={j} />
                  ))}
                  <Key name={kc[1]!} />
                  <X className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 opacity-0 transition group-hover:opacity-100" />
                </button>
              ))}
              <Link
                href={`/settings/controls/${key}/add`}
                className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-background"
              >
                <Plus />
              </Link>
            </div>
          </Fragment>
        ))}
        {children}
      </div>
    </Tabs.Content>
  );
}
