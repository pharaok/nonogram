import * as Dialog from "@radix-ui/react-dialog";
import { Copy, Download, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import useNonogramStore, { selectDimensions, selectSeed } from "store";
import Solution from "./solution";
import { usePathname } from "next/navigation";

const Content = () => {
  const pathname = usePathname();
  const [width, height] = useNonogramStore(selectDimensions);

  const seed = useNonogramStore(selectSeed);
  const [downloadLink, setDownloadLink] = useState("#");
  const solutionEl = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setDownloadLink(solutionEl.current!.toDataURL("image/png"));
  }, []);

  return (
    <>
      <div className="m-4 flex w-full flex-col items-center justify-center bg-background-alt p-4 shadow-xl shadow-black/50">
        <Solution
          ref={solutionEl}
          className="mb-4 w-full border border-black"
        />
        <button
          onClick={() => {
            navigator.clipboard.writeText(seed);
          }}
          className="relative flex items-center gap-1 border-b border-b-transparent hover:border-b-foreground"
        >
          <h3 className="font-bold">{seed}</h3>
          <Copy size={16} />
        </button>
      </div>
      <div className="m-2 flex items-center gap-4">
        <Link
          className="stroke rounded-full border-2 border-blue-700 p-2 text-blue-700 hover:bg-blue-700 hover:text-foreground"
          download={`${seed}.png`}
          href={downloadLink}
          target="_blank"
        >
          <Download size={24} strokeWidth={2} />
        </Link>
      </div>
      <Dialog.Close asChild>
        <Link
          href={{
            pathname,
            query: {
              w: width,
              h: height,
            },
          }}
          className="relative rounded-full bg-primary p-2 font-bold uppercase text-white shadow shadow-black/50 transition-transform after:absolute after:inset-0 after:rounded-full hover:scale-105 after:hover:bg-white/10"
        >
          Play Again
        </Link>
      </Dialog.Close>
    </>
  );
};

export default function WinDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // HACK: workaround for https://github.com/radix-ui/primitives/issues/1386
  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    setRendered(true);
  }, []);

  return (
    <Dialog.Root open={rendered && open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background-alt/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 flex w-10/12 max-w-md -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-lg bg-background py-4 px-8">
          <Dialog.Title className="mb-4 text-lg font-bold">
            You Won!
          </Dialog.Title>
          <Dialog.Close className="absolute top-4 right-4 inline-flex items-center justify-center rounded-full">
            <X />
          </Dialog.Close>
          <Content />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
