import { Channel, Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "create-server"
  | "invite-member"
  | "update-server"
  | "manage-members"
  | "manage-channels"
  | "leave-server"
  | "delete-server"
  | "delete-channel"
  | "edit-channel"
  | "message-file";
interface ModalData {
  server?: Server;
  channel?: Partial<Channel>;
  apiUrl?: string;
  query?: Record<string, any>;
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
