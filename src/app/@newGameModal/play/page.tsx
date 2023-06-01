"use client";

import Input from "components/input";
import Modal from "components/modal";
import NumberInput from "components/numberInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Play() {
  const router = useRouter();
  let { width, height } = JSON.parse(
    localStorage.getItem("lastDimensions") ?? "{}"
  );
  if (typeof width !== "number") width = 10;
  if (typeof height !== "number") height = 10;
  const [dimensions, setDimensions] = useState({ width, height } as {
    width: number;
    height: number;
  });
  const [seed, setSeed] = useState("");
  return (
    <Modal
      title="New game:"
      open={true}
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
      forceMount
    >
      <div className="mx-8 flex flex-col items-center gap-4">
        <div className="grid w-full grid-cols-2 gap-4">
          {(Object.keys(dimensions) as (keyof typeof dimensions)[]).map(
            (d, i) => (
              <div key={i}>
                <label htmlFor={d}>{d}</label>
                <NumberInput
                  name={d}
                  value={dimensions[d]}
                  onChange={(value) => {
                    setDimensions({ ...dimensions, [d]: +value });
                  }}
                  min={1}
                  max={50}
                />
              </div>
            )
          )}
        </div>
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
              w: dimensions.width,
              h: dimensions.height,
              s: seed || null,
            },
          }}
          className="relative min-w-[6rem] rounded-full bg-primary p-2 text-center font-bold uppercase text-white shadow shadow-black/50 transition-transform after:absolute after:inset-0 hover:scale-105 hover:after:rounded-full after:hover:bg-white/10"
        >
          PLAY
        </Link>
      </div>
    </Modal>
  );
}
