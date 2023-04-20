import * as Dialog from "@radix-ui/react-dialog";
import { Copy, Download, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import useNonogramStore, { selectSeed } from "store";
import Solution from "./solution";

const Content = () => {
  const seed = useNonogramStore(selectSeed);
  const [downloadLink, setDownloadLink] = useState("#");
  const solutionEl = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setDownloadLink(solutionEl.current!.toDataURL("image/png"));
  }, []);

  return (
    <>
      <div className="mb-8 flex w-full flex-col items-center justify-center bg-gray-200 p-4 shadow-xl shadow-black/50">
        <Solution
          ref={solutionEl}
          className="mb-4 w-full border border-black"
        />
        <button
          onClick={() => {
            navigator.clipboard.writeText(seed);
          }}
          className="relative flex items-center gap-1 border-b border-b-transparent hover:border-b-black"
        >
          <h3 className="font-bold">{seed}</h3>
          <Copy className="h-5 w-5" />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <Link
          className="rounded-full border-2 border-current p-2 text-blue-700 hover:bg-current [&>*]:hover:text-white"
          download={`${seed}.png`}
          href={downloadLink}
          target="_blank"
        >
          <Download className="h-5 w-5" />
        </Link>
      </div>
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
        <Dialog.Overlay className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 flex w-10/12 max-w-md -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-lg bg-white py-4 px-8">
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
