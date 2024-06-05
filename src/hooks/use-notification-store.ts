import { safeNotificationType } from "@/types";
import { create } from "zustand";

type storedNotifType = safeNotificationType & { isDisplayed: boolean };

interface useNotificationStore {
  notifications: storedNotifType[];
  setNotifications: (
    notification: safeNotificationType,
    notifications: storedNotifType[]
  ) => void;
  resetNotifications: () => void;
  setDisplayNotif: (
    notification: storedNotifType,
    notifications: storedNotifType[]
  ) => void;
}
export const useNotifications = create<useNotificationStore>((set) => ({
  notifications: [],
  resetNotifications: () => set({ notifications: [] }),
  setNotifications: (notification, currentNotifications) => {
    if (!currentNotifications.find((n) => n.id === notification.id)) {
      set({
        notifications: [
          ...currentNotifications,
          { ...notification, isDisplayed: false },
        ],
      });
    }
  },
  setDisplayNotif: (notif, notifs) => {
    const currentNotifs = notifs;
    const i = currentNotifs.findIndex((n) => n.id === notif.id);
    currentNotifs[i].isDisplayed = true;
    set({ notifications: currentNotifs });
  },
}));
