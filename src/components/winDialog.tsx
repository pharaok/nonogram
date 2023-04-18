import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import useNonogramStore, { selectSeed } from "store";
import Solution from "./solution";

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

  const seed = useNonogramStore(selectSeed);

  return (
    <Dialog.Root open={rendered && open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 flex w-10/12 max-w-md -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-lg bg-white py-4 px-8">
          <Dialog.Title className="mb-4 text-lg font-bold">
            You Won!
          </Dialog.Title>
          <Dialog.Close className="absolute top-4 right-4 inline-flex items-center justify-center rounded-full">
            <RxCross2 className="h-6 w-6" />
          </Dialog.Close>
          <div className="bg-gray-200 p-4 shadow-xl shadow-black/50">
            <Solution className="w-full border border-black" />
            <h3 className="text-center font-bold">{seed}</h3>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
