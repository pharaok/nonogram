"use client";

import {
  ArrowBigUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronUp,
  Command,
  CornerDownLeft,
  Delete,
  LayoutGrid,
  LucideIcon,
  LucideProps,
  Option,
  Space,
} from "lucide-react";

const icons: { [key: string]: () => LucideIcon | undefined } = {
  Alt: () => {
    const ua = navigator.userAgent;
    if (ua.includes("Mac")) return Option;
  },
  ArrowDown: () => ArrowDown,
  ArrowLeft: () => ArrowLeft,
  ArrowRight: () => ArrowRight,
  ArrowUp: () => ArrowUp,
  Backspace: () => Delete,
  Control: () => ChevronUp,
  Enter: () => CornerDownLeft,
  Shift: () => ArrowBigUp,
  Meta: () => {
    const ua = navigator.userAgent;
    if (ua.includes("Windows"))
      return (props: LucideProps) => (
        <LayoutGrid fill="currentcolor" {...props} />
      );
    else if (ua.includes("Mac")) return Command;
  },
  [" "]: () => Space,
};

const labels: { [key: string]: string | (() => string) } = {
  Alt: () => {
    const ua = navigator.userAgent;
    if (ua.includes("Mac")) return "";
    return "Alt";
  },
  ArrowDown: "",
  ArrowLeft: "",
  ArrowRight: "",
  ArrowUp: "",
  Backspace: "BkSp",
  Control: "Ctrl",
  Delete: "Del",
  Escape: "Esc",
  Insert: "Ins",
  Meta: () => {
    const ua = navigator.userAgent;
    if (ua.includes("Windows")) return "";
    else if (ua.includes("Mac")) return "";
    return "Meta";
  },
  PageDown: "PgDn",
  PageUp: "PgUp",
  [" "]: "",
};

export default function Key({ name }: { name: string }) {
  let Icon;
  if (name in icons) Icon = icons[name]();
  let label = labels[name] ?? name;
  if (typeof label === "function") {
    label = label();
  }
  return (
    <kbd className="text-md box-border flex min-w-[36px] items-center justify-center gap-1 rounded-md border-2 border-b-4 border-foreground p-1">
      {Icon && <Icon size={20} />}
      {label && <span>{label}</span>}
    </kbd>
  );
}
