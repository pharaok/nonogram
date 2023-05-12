"use client";

import * as Tabs from "@radix-ui/react-tabs";
import Button from "components/button";
import ColorInput from "components/colorInput";
import Key from "components/key";
import { setDocumentColor, toRGB } from "helpers";
import produce from "immer";
import { isEqual, startCase } from "lodash-es";
import { Plus, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { Color, useSettings } from "settings";

export default function Settings() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const keys = useSettings((state) => state.keys);
  const setKeys = useSettings((state) => state.setKeys);
  const [currKeys, setCurrKeys] = useState(keys);

  const colors = useSettings((state) => state.colors);
  const setColor = useSettings((state) => state.setColor);
  const [currColors, setCurrColors] = useState(colors);

  useEffect(() => {
    if (
      !(
        "action" in params &&
        params.action in currKeys &&
        searchParams.has("k")
      )
    )
      return;
    const action = params.action as keyof typeof currKeys;

    const k = searchParams.get("k")!.split(" ");
    const mods = k.slice(0, -1);
    const key = k[k.length - 1];
    if (currKeys[action].some((kc) => isEqual(kc, [mods, key]))) return;

    setCurrKeys(
      produce(currKeys, (draft) => {
        draft[action].push([mods, key]);
      })
    );
    router.push("/settings");
  }, [params, searchParams]);

  return (
    <main className="relative flex-1">
      <Tabs.Root
        defaultValue="controls"
        className="absolute inset-0 mx-8 mb-8 flex flex-col gap-2 md:mx-[20%]"
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

        <div className="flex h-full flex-col justify-between gap-[inherit]">
          <Tabs.Content asChild value="controls">
            <div className="grid grid-cols-2 items-center gap-[inherit]">
              {(Object.keys(currKeys) as (keyof typeof keys)[]).map(
                (key, i) => (
                  <Fragment key={i}>
                    <span>{key}</span>
                    <div>
                      <div className="flex flex-wrap gap-2">
                        {currKeys[key].map((kc, i) => (
                          <button
                            key={i}
                            className="group relative flex gap-1 rounded-md bg-secondary p-1 after:absolute after:inset-0 after:rounded-md after:transition hover:after:bg-red-400"
                            onClick={() => {
                              setCurrKeys(
                                produce(currKeys, (draft) => {
                                  draft[key].splice(i, 1);
                                })
                              );
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
                          href={`/settings/${key}/add`}
                          className="flex aspect-square h-full items-center justify-center rounded-md bg-primary text-background"
                        >
                          <Plus />
                        </Link>
                      </div>
                    </div>
                  </Fragment>
                )
              )}
            </div>
          </Tabs.Content>
          <Tabs.Content asChild value="theme">
            <div className="grid grid-cols-3 items-center gap-[inherit]">
              {(Object.keys(currColors) as Color[]).map((color, i) => (
                <Fragment key={i}>
                  <label className="col-span-2">
                    {startCase(`${color} color`)}
                  </label>
                  <ColorInput
                    value={currColors[color]}
                    onChange={(value) => {
                      setDocumentColor(color, value);
                      setCurrColors(
                        produce(currColors, (draft) => {
                          draft[color] = value;
                        })
                      );
                    }}
                  />
                </Fragment>
              ))}
            </div>
          </Tabs.Content>

          <div className="grid grid-cols-6 gap-[inherit]">
            <Button
              className="col-start-5 bg-red-400"
              disabled={(Object.keys(colors) as Color[]).every(
                (color) => toRGB(currColors[color]) === colors[color]
              )}
              onClick={() => {
                setCurrColors(colors);

                (Object.keys(colors) as Color[]).map((color) => {
                  setDocumentColor(color, toRGB(colors[color]));
                });
              }}
            >
              reset
            </Button>
            <Button
              className="bg-primary hover:bg-secondary"
              onClick={() => {
                (Object.keys(currColors) as Color[]).map((color) => {
                  setColor(color, toRGB(currColors[color]));
                });
              }}
            >
              apply
            </Button>
          </div>
        </div>
      </Tabs.Root>
    </main>
  );
}
