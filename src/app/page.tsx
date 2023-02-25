import Canvas from "components/canvas";
export default function Home() {
  return (
    <main>
      <Canvas grid={Array.from(Array(10), () => Array(10).fill(0))}></Canvas>
    </main>
  );
}
