"use client";

import * as Tabs from "@radix-ui/react-tabs";
import ColorInput from "components/colorInput";
import { setDocumentColor } from "helpers";
import { startCase } from "lodash-es";
import { Fragment, useContext } from "react";
import { Color, SettingsContext } from "settings";
import { useStore } from "zustand";

export default function Theme() {
  const settingsDraftStore = useContext(SettingsContext)!;
  const colors = useStore(settingsDraftStore, (state) => state.settings.colors);
  const setSettingsDraft = useStore(settingsDraftStore, (state) => state.set);

  return (
    <Tabs.Content value="theme">
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
