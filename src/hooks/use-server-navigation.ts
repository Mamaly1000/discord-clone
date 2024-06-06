import { create } from "zustand";

interface useServerNavigationStore {
  open: boolean;
  onChange: (open: boolean) => void;
}
export const useServerNavigation = create<useServerNavigationStore>((set) => ({
  onChange: (open) => set({ open }),
  open: false,
}));
