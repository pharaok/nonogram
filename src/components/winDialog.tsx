import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";

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
        <Dialog.Overlay className="fixed inset-0 bg-black/25" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-10/12 max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4">
          <Dialog.Title className="text-center text-lg font-bold">
            You Won!
          </Dialog.Title>
          <Dialog.Close className="absolute top-4 right-4 inline-flex items-center justify-center rounded-full">
            <RxCross2 className="h-6 w-6" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
