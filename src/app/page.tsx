"use client";

import Nonogram from "components/nonogram";
import { base64ToGrid, bigIntToBase64, randomBigInt } from "helpers/base64";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createNonogramStore, NonogramContext } from "store";

export default function Home() {
  const searchParams = useSearchParams();
  const width = +(searchParams!.get("w") ?? "10");
  const height = +(searchParams!.get("h") ?? "10");
  let [store, setStore] = useState(
    createNonogramStore(
      Array.from(Array(height), () => Array.from(Array(width), () => 0))
    )
  );
  useEffect(() => {
    const seed =
      searchParams!.get("s") ?? bigIntToBase64(randomBigInt(width * height));
    const grid = base64ToGrid(seed, width, height);
    setStore(createNonogramStore(grid));
  }, [width, height]);

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
