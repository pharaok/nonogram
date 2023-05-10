"use client";

import Modal from "components/modal";
import { useRouter } from "next/navigation";

export default function NewGameModal() {
  const router = useRouter();
  return (
    <Modal
      title="New game:"
      open={true}
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    ></Modal>
  );
}
