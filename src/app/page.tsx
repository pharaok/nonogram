"use client";

import Controls from "components/controls";
import Nonogram from "components/nonogram";
import WinModal from "components/winModal";
import { base64ToGrid, bigIntToBase64, randomBigInt } from "helpers/base64";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useNonogramStore, {
  createNonogramStore,
  NonogramContext,
  selectIsSolved,
  selectSeed,
} from "store";
import { useStore } from "zustand";

const WinDialogWrapper = () => {
  const solution = useNonogramStore((state) => state.solution);
  const isSolved = useNonogramStore(selectIsSolved);
  const [wasSolved, setWasSolved] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (isSolved) setWasSolved(true);
  }, [isSolved]);

  useEffect(() => {
    if (wasSolved) setDialogOpen(true);
  }, [wasSolved]);

  useEffect(() => {
    setWasSolved(false);
  }, [solution]);

  return (
    <WinModal open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)} />
  );
};

export default function Home() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const width = +(searchParams!.get("w") ?? "10");
  const height = +(searchParams!.get("h") ?? "10");
  let seed = searchParams!.get("s");
  const [store, setStore] = useState(
    createNonogramStore(
      seed
        ? base64ToGrid(seed, width, height)
        : Array.from(Array(height), () => Array.from(Array(width), () => 1))
    )
  );
  const currentSeed = useStore(store, selectSeed);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    seed ||= bigIntToBase64(randomBigInt(width * height));
    if (seed !== currentSeed) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("s", seed);
      router.replace(pathname + "?" + newSearchParams.toString());

      const grid = base64ToGrid(seed, width, height);
      setStore(createNonogramStore(grid));
    }
    setVisible(true);
  }, [pathname, router, searchParams, seed, width, height]);

  return (
    <NonogramContext.Provider value={store}>
      <main className="relative flex-1">
        <div
          className="absolute inset-0 flex flex-col items-center justify-evenly gap-8 p-4 md:flex-row md:p-8"
          style={{ visibility: visible ? "visible" : "hidden" }}
        >
          <Nonogram />
          <Controls />
        </div>
      </main>
      <WinDialogWrapper />
    </NonogramContext.Provider>
  );
}
