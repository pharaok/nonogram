"use client";

import Nonogram from "components/nonogram";
import { useState } from "react";
import { createNonogramStore, NonogramContext } from "store";
import { useSearchParams } from "next/navigation";
import { base64ToGrid } from "helpers/base64";

export default function Home() {
  const searchParams = useSearchParams();
  const width = +(searchParams!.get("w") ?? 10);
  const height = +(searchParams!.get("h") ?? 10);
  const seed = searchParams!.get("s");
  const grid = seed
    ? base64ToGrid(seed, width, height)
    : Array.from(Array(height), () => Array(width).fill(0));
  let [store] = useState(createNonogramStore(grid));

  return (
    <main>
      <NonogramContext.Provider value={store}>
        <div className="max-w-xl">
          <Nonogram />
        </div>
      </NonogramContext.Provider>
    </main>
  );
}
