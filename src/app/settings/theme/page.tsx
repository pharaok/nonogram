"use client";

import * as Tabs from "@radix-ui/react-tabs";
import Button from "components/button";
import ColorInput from "components/colorInput";
import Heading from "components/heading";
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
    error: "248 113 113",
  },
  "catpuccin-mocha": {
    background: "#1e1e2e",
    backgroundAlt: "#11111b",
    foreground: "#cdd6f4",
    primary: "#cba6f7",
    secondary: "#89b4fa",
    error: "#f38ba8",
  },
  dracula: {
    background: "#282a36",
    backgroundAlt: "#21222c",
    foreground: "#f8f8f2",
    primary: "#bd93f9",
    secondary: "#50fa7b",
    error: "#ff5555",
  },
  github: {
    background: "#0d1117",
    backgroundAlt: "#161b22",
    foreground: "#ffffff",
    primary: "#2f81f7",
    secondary: "#2ea043",
    error: "#f85249",
  },
  "gruvbox-dark": {
    background: "#282828",
    backgroundAlt: "#1d2021",
    foreground: "#ebdbb2",
    primary: "#d65d0e",
    secondary: "#98971a",
    error: "#cc241d",
  },
  "gruvbox-light": {
    background: "#fbf1c7",
    backgroundAlt: "#f9f5d7",
    foreground: "#3c3836",
    primary: "#d65d0e",
    secondary: "#98971a",
    error: "#cc241d",
  },
  nord: {
    background: "#3b4252",
    backgroundAlt: "#2e3440",
    foreground: "#eceff4",
    primary: "#88c0d0",
    secondary: "#5e81ac",
    error: "#bf616a",
  },
  "one-dark": {
    background: "#282c34",
    backgroundAlt: "#21242b",
    foreground: "#abb2bf",
    primary: "#c678dd",
    secondary: "#61afef",
    error: "#e06c75",
  },
  "tokyonight-storm": {
    background: "#24283b",
    backgroundAlt: "#1a1b26",
    foreground: "#a9b1d6",
    primary: "#bb9af7",
    secondary: "#7aa2f7",
    error: "#f7768e",
  },
  "vscode-dark": {
    background: "#1e1e1e",
    backgroundAlt: "#252526",
    foreground: "#d4d4d4",
    primary: "#569cd6",
    secondary: "#369432",
    error: "#f44747",
  },
};

export default function Theme() {
  const settingsDraftStore = useContext(SettingsContext)!;
  const colors = useStore(settingsDraftStore, (state) => state.settings.colors);
  const setSettingsDraft = useStore(settingsDraftStore, (state) => state.set);

  return (
    <Tabs.Content value="theme" className="flex flex-col gap-8">
      <section>
        <Heading index={3} className="text-primary">
          Presets
        </Heading>
        <div className="flex flex-wrap justify-center gap-2">
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
      </section>
      <section>
        <Heading index={3} className="text-primary">
          Custom
        </Heading>
        <div className="grid grid-cols-3 items-center gap-2">
          {(Object.keys(colors) as Color[]).map((color, i) => (
            <Fragment key={i}>
              <label className="col-span-2">
                {startCase(`${color} color`)}
              </label>
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
      </section>
    </Tabs.Content>
  );
}
