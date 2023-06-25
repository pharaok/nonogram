import * as Dialog from "@radix-ui/react-dialog";
import { Copy, Download } from "lucide-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import useNonogramStore, { selectDimensions, selectSeed } from "store";
import Link from "./link";
import Modal from "./modal";
import Solution from "./solution";

export default function WinModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const [width, height] = useNonogramStore(selectDimensions);

  const seed = useNonogramStore(selectSeed);
  const [imageURL, setImageURL] = useState("");

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="You won!">
      <div className="m-4 flex w-full flex-col items-center justify-center bg-background-alt p-4 shadow-xl shadow-black/25">
        <Solution
          className="mb-4 w-full border border-black"
          onImageURLChange={setImageURL}
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
          href={imageURL}
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
    </Modal>
  );
}
