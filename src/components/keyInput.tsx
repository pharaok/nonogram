import { usePathname } from "next/navigation";
import { useState } from "react";
import { KeyCombo } from "types";
import Button from "./button";
import Key from "./key";
import Modal, { ModalProps } from "./modal";

const modKeys = {
  Alt: ["Alt"],
  Control: ["Control"],
  Meta: ["Meta", "OS"],
  Shift: ["Shift"],
};

export default function KeyInput({
  value,
  onChange,
  onSubmit,
  ...props
}: {
  value: KeyCombo;
  onChange: (k: KeyCombo) => void;
  onSubmit: (k: KeyCombo) => void;
} & ModalProps) {
  const [currMods, setCurrMods] = useState<string[]>(value[0]);
  const [mods, key] = value;

  return (
    <Modal title="Keybinding" {...props}>
      <form
        className="flex w-full flex-col items-center"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(value);
        }}
      >
        <div
          className="flex h-16 w-full cursor-pointer items-center gap-2 rounded-md bg-background-alt p-2 outline-1 focus:outline active:outline"
          tabIndex={0}
          onBlur={() => {
            setCurrMods([]);
          }}
          onKeyDown={(e) => {
            if (e.repeat) return;
            e.preventDefault();
            const k = e.key[0].toUpperCase() + e.key.slice(1);

            let isMod = false;
            let m: keyof typeof modKeys;
            const ncm = [...currMods];
            for (m in modKeys) {
              if (modKeys[m].includes(k) && !ncm.includes(m)) {
                ncm.push(m);
                isMod = true;
              }
            }

            setCurrMods(ncm);
            if (isMod) {
              onChange([ncm, null]);
              return;
            }
            onChange([ncm, k]);
          }}
          onKeyUp={(e) => {
            const k = e.key[0].toUpperCase() + e.key.slice(1);

            let isMod = false;
            let m: keyof typeof modKeys;
            const ncm = [...currMods];
            for (m in modKeys) {
              if (modKeys[m].includes(k)) {
                ncm.splice(ncm.indexOf(m), 1);
                isMod = true;
              }
            }
            setCurrMods(ncm);
            if (!key) onChange([ncm, null]);
          }}
        >
          {(key ? mods : currMods).map((mod, i) => (
            <Key key={i} name={mod} />
          ))}
          {key && <Key name={key} />}
        </div>
        <Button type="submit" className="bg-primary px-4">
          confirm
        </Button>
      </form>
    </Modal>
  );
}
