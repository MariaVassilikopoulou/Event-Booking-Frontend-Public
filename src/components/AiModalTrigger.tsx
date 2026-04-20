"use client";

import { ReactNode } from "react";
import { useAiModalStore } from "@/stores/useAiModalStore";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function AiModalTrigger({ children, className }: Props) {
  const open = useAiModalStore((state) => state.open);

  return (
    <button type="button" className={className} onClick={open}>
      {children}
    </button>
  );
}
