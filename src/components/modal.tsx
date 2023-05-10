import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Modal({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children?: React.ReactNode;
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
            {title}
          </Dialog.Title>
          <Dialog.Close className="absolute top-4 right-4 inline-flex items-center justify-center rounded-full">
            <X />
          </Dialog.Close>
          {children}
          <Dialog.Content />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
