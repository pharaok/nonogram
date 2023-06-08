"use client";

import Link from "components/link";
import Modal from "components/modal";
import SizeInput from "components/sizeInput";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { GridContext, selectDimensions } from "store";
import { useStore } from "zustand";

export default function SizeModal() {
  const gridStore = useContext(GridContext)!;
  const [currWidth, currHeight] = useStore(gridStore, selectDimensions);
  const router = useRouter();
  const [width, setWidth] = useState(currWidth);
  const [height, setHeight] = useState(currHeight);

  return (
    <Modal open={true} onOpenChange={() => router.back()} title="Resize canvas">
      <div className="flex flex-col items-center gap-4">
        <SizeInput
          width={width}
          height={height}
          onWidthChange={setWidth}
          onHeightChange={setHeight}
        />
        <Link
          href={{
            pathname: "/editor",
            query: { w: width, h: height },
          }}
          className="!bg-primary px-2 !text-background hover:!bg-foreground"
          variant="button"
        >
          Confirm
        </Link>
      </div>
    </Modal>
  );
}
