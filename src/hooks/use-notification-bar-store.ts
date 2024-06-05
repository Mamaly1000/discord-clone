import { create } from "zustand";

interface useNotifBarStore {
  open: boolean;
  onChange: (open: boolean) => void;
}

export const useNotifBar = create<useNotifBarStore>((set) => ({
  open: false,
  onChange: (open) => set({ open }),
}));
