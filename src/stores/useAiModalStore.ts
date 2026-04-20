import { create } from "zustand";

interface AiModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useAiModalStore = create<AiModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
