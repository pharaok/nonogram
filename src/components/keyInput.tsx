import { isMod, useMods } from "hooks";
import { KeyCombo } from "types";
import Button from "./button";
import Key from "./key";
import Modal, { ModalProps } from "./modal";
import { useRef } from "react";

export default function KeyInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  forceMount,
  ...props
}: {
  value: KeyCombo;
  onChange: (k: KeyCombo) => void;
  onSubmit: (k: KeyCombo) => void;
  placeholder?: string;
  forceMount?: true;
} & ModalProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const currMods = useMods(divRef.current!);
  const [mods, key] = value;

  return (
    <Modal title="Keybinding" {...props} forceMount={forceMount}>
      <form
        className="flex w-full flex-col items-center gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(value);
        }}
      >
        <div
          className="flex h-16 w-full cursor-pointer items-center gap-2 rounded-md bg-background-alt p-2 outline-1 focus:outline active:outline"
          ref={divRef}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.repeat) return;
            e.preventDefault();
            const k = e.key[0].toUpperCase() + e.key.slice(1);
            if (isMod(e.key)) onChange([currMods, null]);
            else onChange([currMods, k]);
          }}
          onKeyUp={() => {
            if (!key) onChange([currMods, null]);
          }}
        >
          <span className="hidden select-none italic text-foreground/50 only:inline">
            {placeholder}
          </span>
          {(key ? mods : currMods).map((mod, i) => (
            <Key key={i} name={mod} />
          ))}
          {key && <Key name={key} />}
        </div>
        <Button type="submit" className="bg-primary px-4">
          Confirm
        </Button>
      </form>
    </Modal>
  );
}
