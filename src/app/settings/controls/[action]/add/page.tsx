"use client";

import KeyInput from "components/keyInput";
import { startCase } from "lodash-es";
import { notFound, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useSettings } from "settings";
import { KeyCombo } from "types";

export default function KeyInputModal({
  params: { action },
}: {
  params: { action: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const keys = useSettings((state) => state.settings.keys);
  const [key, setKey] = useState<KeyCombo>([[], null]);

  if (!Object.keys(keys).includes(action)) notFound();

  return (
    <KeyInput
      title={startCase(action)}
      placeholder="Press a key..."
      forceMount
      open={true}
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
      value={key}
      onChange={(k) => {
        setKey(k);
      }}
      onSubmit={(k) => {
        router.push(
          `${pathname.slice(0, pathname.lastIndexOf("/"))}?k=${(
            k[0] as string[]
          )
            .concat(k[1]!)
            .join("+")}`
        );
      }}
    />
  );
}
