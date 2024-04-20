import { Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType = "create-server" | "invite-member" | "update-server";
interface ModalData {
  server?: Server;
}
interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: ({ type, data }: { type: ModalType; data?: ModalData }) => void;
  onClose: () => void;
  data: ModalData;
}
export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: ({ type, data = {} }) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null, data: {} }),
  data: {},
}));
