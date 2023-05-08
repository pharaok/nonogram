"use client";

import Controls from "components/controls";
import Nonogram from "components/nonogram";
import WinDialog from "components/winDialog";
import { base64ToGrid, bigIntToBase64, randomBigInt } from "helpers/base64";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useNonogramStore, {
  createNonogramStore,
  NonogramContext,
  selectIsSolved,
} from "store";

const WinDialogWrapper = () => {
  const isSolved = useNonogramStore(selectIsSolved);
  const [wasSolved, setWasSolved] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (isSolved) setWasSolved(true);
  }, [isSolved]);

  useEffect(() => {
    if (wasSolved) setDialogOpen(true);
  }, [wasSolved]);

  return (
    <WinDialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)} />
  );
};

export default function Home() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const width = +(searchParams!.get("w") ?? "10");
  const height = +(searchParams!.get("h") ?? "10");
  const [store, setStore] = useState(
    createNonogramStore(
      Array.from(Array(height), () => Array.from(Array(width), () => 1))
    )
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (!searchParams.has("s")) {
      newSearchParams.set("s", bigIntToBase64(randomBigInt(width * height)));
      // WARN: no shallow routing in next 13 (yet) and window.history doesn't work
      router.replace(pathname + "?" + newSearchParams.toString());
    }
    const seed = newSearchParams!.get("s")!;
    const grid = base64ToGrid(seed, width, height);
    setStore(createNonogramStore(grid));
    setVisible(true);
  }, [pathname, router, searchParams, width, height]);

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
