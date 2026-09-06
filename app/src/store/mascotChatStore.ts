import { create } from 'zustand';

interface MascotChatState {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
}

export const useMascotChatStore = create<MascotChatState>((set) => ({
  isOpen: false,
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
}));
