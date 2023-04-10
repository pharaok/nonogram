import Canvas from "components/canvas";
import { useEffect, useRef, useState } from "react";
import useNonogramStore, { selectClues, selectDimensions } from "store";
import Clues from "./clues";

export default function Nonogram() {
  const nonogramRef = useRef<HTMLDivElement | null>(null);
  const [width, height] = useNonogramStore(selectDimensions);
  const clues = useNonogramStore(selectClues);
  const [longestRowClue, longestColClue] = Array.from(Array(2)).map((_, i) =>
    Math.max(1, ...clues[i].map((cs) => cs.length))
  );
  const [boundingDimension, setBoundingDimension] = useState("width");

  const emphasizeBorder = (i: number, l: number) => i % l == 0;

  // if we cause the parent to overflow with the
  // current dimension set to 100%, switch the dimension
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const { width: w, height: h } = entries[0].contentRect;
      const { scrollWidth: sw, scrollHeight: sh } = entries[0].target;
      if (sw > w) {
        setBoundingDimension("width");
      } else if (sh > h) {
        setBoundingDimension("height");
      }
    });
    resizeObserver.observe(nonogramRef.current!.parentElement!);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={nonogramRef}
      className="grid"
      style={{
        gridTemplateRows: `${longestColClue}fr ${height}fr`,
        gridTemplateColumns: `${longestRowClue}fr ${width}fr`,
        aspectRatio: `${width + longestRowClue} / ${height + longestColClue}`,
        [boundingDimension]: "100%",
      }}
    >
      <div
        className="pointer-events-none z-10 grid"
        style={{
          gridRow: `1 / 3`,
          gridColumn: `1 / 3`,
          gridTemplateRows: `${longestColClue}fr repeat(${height}, 1fr)`,
          gridTemplateColumns: `${longestRowClue}fr repeat(${width}, 1fr)`,
        }}
      >
        {Array.from(Array(height + 1)).map((_, i) => (
          <div
            key={i}
            className="border-black"
            style={{
              borderBottomWidth: emphasizeBorder(i, height) ? 2 : 1,
              gridRow: `${i + 1} / ${i + 1}`,
              gridColumn: `1 / ${width + longestRowClue + 1}`,
            }}
          ></div>
        ))}
        {Array.from(Array(width + 1)).map((_, i) => (
          <div
            key={i}
            className="border-black"
            style={{
              borderRightWidth: emphasizeBorder(i, width) ? 2 : 1,
              gridRow: `1 / ${height + longestColClue + 1}`,
              gridColumn: `${i + 1} / ${i + 1}`,
            }}
          ></div>
        ))}
      </div>
      <div style={{ gridArea: "1 / 2" }}>
        <Clues direction="column" />
      </div>
      <div style={{ gridArea: "2 / 1" }}>
        <Clues direction="row" />
      </div>
      <div style={{ gridArea: "2 / 2" }}>
        <Canvas />
      </div>
    </div>
  );
}
