import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Button from "./button";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children?: React.ReactNode;
  forceMount?: true;
}

export default function Modal({
  open,
  onOpenChange,
  title,
  children,
  forceMount,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal
        // HACK: workaround for https://github.com/radix-ui/primitives/issues/1386
        container={document.getElementById("modal-root")}
        forceMount={forceMount}
      >
        <Dialog.Overlay className="fixed inset-0 bg-background-alt/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex w-10/12 max-w-md -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-lg bg-background px-8 py-4">
          <Dialog.Title className="mb-4 text-lg font-bold">
            {title}
          </Dialog.Title>
          <Dialog.Close asChild>
            <Button className="absolute right-4 top-4 inline-flex items-center justify-center !rounded-full bg-transparent bg-none enabled:hover:!bg-error">
              <X />
            </Button>
          </Dialog.Close>
          {children}
          <Dialog.Content />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
