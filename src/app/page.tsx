"use client";

import Nonogram from "components/nonogram";
import { useState } from "react";
import { createNonogramStore, NonogramContext } from "store";

export default function Home() {
  let [store] = useState(
    createNonogramStore(Array.from(Array(20), () => Array(20).fill(0)))
  );

  return (
    <main>
      <NonogramContext.Provider value={store}>
        <div className="max-w-xl border-2 border-red-600">
          <Nonogram />
        </div>
      </NonogramContext.Provider>
    </main>
  );
}
