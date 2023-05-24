"use client";

import * as Tabs from "@radix-ui/react-tabs";
import Button from "components/button";
import ColorInput from "components/colorInput";
import { setDocumentColor, toHex } from "helpers";
import { startCase } from "lodash-es";
import { Fragment, useContext } from "react";
import { Color, SettingsContext } from "settings";
import { EntriesOf } from "types";
import { useStore } from "zustand";

const themes = {
  light: {
    background: "255 255 255",
    backgroundAlt: "224 224 224",
    foreground: "0 0 0",
    primary: "147 51 234",
    secondary: "37 99 235",
  },
  tokyonight: {
    background: "#24283b",
    backgroundAlt: "#1a1b26",
    foreground: "#a9b1d6",
    primary: "#bb9af7",
    secondary: "#7aa2f7",
  },
};

export default function Theme() {
  const settingsDraftStore = useContext(SettingsContext)!;
  const colors = useStore(settingsDraftStore, (state) => state.settings.colors);
  const setSettingsDraft = useStore(settingsDraftStore, (state) => state.set);

  return (
    <Tabs.Content value="theme" className="flex flex-col gap-8">
      <div className="flex flex-wrap">
        {(Object.entries(themes) as EntriesOf<typeof themes>).map(
          ([name, theme]) => (
            <Button
              className="border-2 p-2 hover:text-[color:var(--)]"
              style={{
                backgroundColor: toHex(theme.background),
                color: toHex(theme.foreground),
                borderColor: toHex(theme.foreground),
              }}
              onClick={() => {
                (Object.entries(theme) as EntriesOf<typeof theme>).forEach(
                  ([k, v]) => {
                    setDocumentColor(k, v);
                  }
                );
                setSettingsDraft((draft) => {
                  draft.settings.colors = theme;
                });
              }}
            >
              {name}
            </Button>
          )
        )}
      </div>
      <div className="grid grid-cols-3 items-center">
        {(Object.keys(colors) as Color[]).map((color, i) => (
          <Fragment key={i}>
            <label className="col-span-2">{startCase(`${color} color`)}</label>
            <ColorInput
              value={colors[color]}
              onChange={(value) => {
                setDocumentColor(color, value);
                setSettingsDraft((draft) => {
                  draft.settings.colors[color] = value;
                });
              }}
            />
          </Fragment>
        ))}
      </div>
    </Tabs.Content>
  );
}
