"use client";

import KeyInput from "components/keyInput";
import { startCase } from "lodash-es";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";
import { useSettings } from "settings";
import { KeyCombo } from "types";

export default function KeyInputModal({
  params: { action },
}: {
  params: { action: string };
}) {
  const router = useRouter();
  const keys = useSettings((state) => state.keys);
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
        router.push(`/settings/${action}?k=${k[0].concat(k[1]!).join("+")}`);
      }}
    />
  );
}
