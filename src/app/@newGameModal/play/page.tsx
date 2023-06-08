"use client";

import Input from "components/input";
import Link from "components/link";
import Modal from "components/modal";
import SizeInput from "components/sizeInput";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Play() {
  const router = useRouter();
  let { width: prevWidth, height: prevHeight } = JSON.parse(
    localStorage.getItem("lastDimensions") ?? "{}"
  );
  if (typeof prevWidth !== "number") prevWidth = 10;
  if (typeof prevHeight !== "number") prevHeight = 10;
  const [width, setWidth] = useState(prevWidth);
  const [height, setHeight] = useState(prevWidth);
  const [seed, setSeed] = useState("");
  return (
    <Modal
      title="New game"
      open={true}
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
      forceMount
    >
      <div className="mx-8 flex flex-col items-center gap-4">
        <SizeInput
          width={width}
          height={height}
          onWidthChange={setWidth}
          onHeightChange={setHeight}
        />
        <div className="w-full">
          <label htmlFor="seed">seed</label>
          <Input
            name="seed"
            placeholder="base 64 (A-Za-z0-9-_)"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            className="w-full placeholder:italic placeholder:opacity-50"
          />
        </div>

        <Link
          href={{
            pathname: "/",
            query: {
              w: width,
              h: height,
              s: seed || null,
            },
          }}
          variant="cta"
        >
          PLAY
        </Link>
      </div>
    </Modal>
  );
}
