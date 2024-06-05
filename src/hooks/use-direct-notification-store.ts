import { safeDirectNotification } from "@/types";
import { create } from "zustand";

type storedNotifType = safeDirectNotification & { isDisplayed: boolean };

interface useDirectNotificationStore {
  direct_notifications: storedNotifType[];
  setDirectNotifications: (
    notification: safeDirectNotification,
    notifications: storedNotifType[]
  ) => void;
  resetDirectNotifications: () => void;
  setDirectDisplayNotif: (
    notification: storedNotifType,
    notifications: storedNotifType[]
  ) => void;
}
export const useDirectNotifications = create<useDirectNotificationStore>(
  (set) => ({
    direct_notifications: [],
    resetDirectNotifications: () => set({ direct_notifications: [] }),
    setDirectNotifications: (notification, currentNotifications) => {
      if (!currentNotifications.find((n) => n.id === notification.id)) {
        set({
          direct_notifications: [
            ...currentNotifications,
            { ...notification, isDisplayed: false },
          ],
        });
      }
    },
    setDirectDisplayNotif: (notif, notifs) => {
      const currentNotifs = notifs;
      const i = currentNotifs.findIndex((n) => n.id === notif.id);
      currentNotifs[i].isDisplayed = true;
      set({ direct_notifications: currentNotifs });
    },
  })
);
