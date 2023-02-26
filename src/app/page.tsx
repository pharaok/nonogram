"use client";

import Canvas from "components/canvas";
import { useState } from "react";
import { NonogramGrid } from "types";

export default function Home() {
  let [grid, setGrid] = useState<NonogramGrid>(
    Array.from(Array(100), () => Array(100).fill(0))
  );
  return (
    <main>
      <div className="max-w-xl border-2 border-red-600">
        <Canvas grid={grid} setGrid={setGrid} />
      </div>
    </main>
  );
}
