"use client";

import * as Tabs from "@radix-ui/react-tabs";
import Key from "components/key";
import Link from "components/link";
import { Mod } from "hooks";
import { isEqual, startCase } from "lodash-es";
import { Plus, X } from "lucide-react";
import { useSearchParams, useSelectedLayoutSegment } from "next/navigation";
import { Fragment, useEffect } from "react";
import { Key as KeyT, useSettings } from "settings";

export default function Controls({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const searchParams = useSearchParams();
  const keys = useSettings((state) => state.settings.keys);
  const setSettingsDraft = useSettings((state) => state.set);

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
  }, [segment, searchParams, keys, setSettingsDraft]);

  return (
    <Tabs.Content value="controls">
      <div className="grid grid-cols-3 items-center gap-2 md:grid-cols-2">
        {(Object.keys(keys) as KeyT[]).map((key, i) => (
          <Fragment key={i}>
            <span>{startCase(key)}</span>
            <div className="col-span-2 flex h-full flex-wrap items-center gap-2 rounded-lg bg-primary/10 p-1 md:col-span-1">
              {keys[key].map((kc, i) => (
                <button
                  key={i}
                  className="group relative flex flex-wrap gap-1 rounded-md bg-secondary p-1 after:absolute after:inset-0 after:rounded-md after:transition hover:after:bg-error"
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
                  <X className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 opacity-0 transition group-hover:opacity-100" />
                </button>
              ))}
              <Link
                href={`/settings/controls/${key}/add`}
                className="flex h-8 w-8 items-center justify-center !bg-primary !text-background hover:!bg-foreground"
                variant="button"
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
