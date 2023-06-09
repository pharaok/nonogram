import * as Dialog from "@radix-ui/react-dialog";
import { Copy, Download } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useNonogramStore, { selectDimensions, selectSeed } from "store";
import Modal from "./modal";
import Solution from "./solution";
import NextLink from "next/link";
import Link from "./link";

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
      <div className="m-4 flex w-full flex-col items-center justify-center bg-background-alt p-4 shadow-xl shadow-black/25">
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
        <NextLink
          className="stroke rounded-full border-2 border-blue-700 p-2 text-blue-700 hover:bg-blue-700 hover:text-foreground"
          download={`${seed}.png`}
          href={downloadLink}
          target="_blank"
        >
          <Download size={24} strokeWidth={2} />
        </NextLink>
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
          variant="cta"
        >
          Play Again
        </Link>
      </Dialog.Close>
    </>
  );
};

export default function WinModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title="You won!">
      <Content />
    </Modal>
  );
}
