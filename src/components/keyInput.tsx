import { useMods } from "hooks";
import { KeyCombo } from "types";
import Button from "./button";
import Key from "./key";
import Modal, { ModalProps } from "./modal";

export default function KeyInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  ...props
}: {
  value: KeyCombo;
  onChange: (k: KeyCombo) => void;
  onSubmit: (k: KeyCombo) => void;
  placeholder?: string;
} & ModalProps) {
  const [currMods, m] = useMods();
  const [mods, key] = value;

  return (
    <Modal title="Keybinding" {...props}>
      <form
        className="flex w-full flex-col items-center gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(value);
        }}
      >
        <div
          className="flex h-16 w-full cursor-pointer items-center gap-2 rounded-md bg-background-alt p-2 outline-1 focus:outline active:outline"
          tabIndex={0}
          onBlur={() => {
            m.reset();
          }}
          onKeyDown={(e) => {
            if (e.repeat) return;
            e.preventDefault();
            const k = e.key[0].toUpperCase() + e.key.slice(1);
            const isMod = m.down(e);
            if (isMod) onChange([currMods, null]);
            else onChange([currMods, k]);
          }}
          onKeyUp={(e) => {
            m.up(e);
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
