"use client";

import Controls from "components/controls";
import Nonogram from "components/nonogram";
import WinDialog from "components/winDialog";
import { base64ToGrid, bigIntToBase64, randomBigInt } from "helpers/base64";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useNonogramStore, {
  createNonogramStore,
  NonogramContext,
  selectIsSolved,
} from "store";

const WinDialogWrapper = () => {
  const isSolved = useNonogramStore(selectIsSolved);
  const [dialogOpen, setDialogOpen] = useState(false);
  useEffect(() => {
    setDialogOpen(isSolved);
  }, [isSolved]);

  return (
    <WinDialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)} />
  );
};

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
    <NonogramContext.Provider value={store}>
      {/* HACK: padding on Nonogram's parent breaks the ResizeObserver,
          because overflow eats into padding first, then actually overflows. */}
      <div className="h-full w-full p-8">
        <div className="flex h-full w-full items-center justify-evenly">
          <Nonogram />
          <Controls />
        </div>
        <WinDialogWrapper />
      </div>
    </NonogramContext.Provider>
  );
}
