"use client";

import Link from "components/link";
import Modal from "components/modal";
import NumberInput from "components/numberInput";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EntriesOf } from "types";

export default function SizeModal() {
  const router = useRouter();
  const [dimensions, setDimensions] = useState({ width: 10, height: 10 });
  return (
    <Modal open={true} onOpenChange={() => router.back()} title="Resize canvas">
      <div className="flex flex-col items-center gap-4">
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(dimensions) as EntriesOf<typeof dimensions>).map(
            ([k, v], i) => (
              <div key={i}>
                <label htmlFor={k}>{k}</label>
                <NumberInput
                  value={v}
                  onChange={(v) => setDimensions({ ...dimensions, [k]: v })}
                  min={1}
                  max={50}
                />
              </div>
            )
          )}
        </div>
        <Link
          href={{
            pathname: "/editor",
            query: { w: dimensions.width, h: dimensions.height },
          }}
          className="bg-primary px-2 py-1"
          variant="button"
        >
          Confirm
        </Link>
      </div>
    </Modal>
  );
}
