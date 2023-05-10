"use client";

import * as Tabs from "@radix-ui/react-tabs";
import Button from "components/button";
import ColorInput from "components/colorInput";
import { setDocumentColor, toRGB } from "helpers";
import produce from "immer";
import { startCase } from "lodash-es";
import { Fragment, useState } from "react";
import { Color, useSettings } from "settings";

export default function Settings() {
  const colors = useSettings((state) => state.colors);
  const setColor = useSettings((state) => state.setColor);
  const [currColors, setCurrColors] = useState(colors);
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

        <Tabs.Content value="controls">Controls</Tabs.Content>
        <Tabs.Content asChild value="theme">
          <div className="grid grid-cols-3 gap-[inherit]">
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

        <div className="flex-1"></div>
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
      </Tabs.Root>
    </main>
  );
}
