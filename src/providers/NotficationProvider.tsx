"use client";
import UserAvatar from "@/components/common/UserAvatar";
import useDirectNotificationQuery from "@/hooks/use-direct-notification-query";
import { useDirectNotifications } from "@/hooks/use-direct-notification-store";
import { useNotifBar } from "@/hooks/use-notification-bar-store";
import useNotificationQuery from "@/hooks/use-notification-query";
import { useNotifications } from "@/hooks/use-notification-store";
import { cn } from "@/lib/utils";
import { formatDistanceToNowStrict } from "date-fns";
import { useTheme } from "next-themes";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { toast, Toaster } from "sonner";

const NotficationProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const params = useParams();

  const { resolvedTheme } = useTheme();
  const { open: isNotifBarOpen } = useNotifBar();

  const { data: notifications_data, isLoading: notifications_isLoading } =
    useNotificationQuery({ serverId: params?.serverId as string });
  const {
    data: direct_notifications_data,
    isLoading: direct_notifications_isLoading,
  } = useDirectNotificationQuery({ serverId: params?.serverId as string });

  const { notifications, setDisplayNotif, setNotifications } =
    useNotifications();
  const {
    direct_notifications,
    setDirectDisplayNotif,
    setDirectNotifications,
  } = useDirectNotifications();

  useEffect(() => {
    if (!notifications_isLoading) {
      if (notifications_data && notifications_data.pages.length > 0) {
        notifications_data.pages
          .filter((p) => p.items.length > 0)
          .forEach((p) => {
            const notifs = p.items;
            notifs
              .filter((n) => {
                return !n.isSeen;
              })
              .forEach((n) => {
                setNotifications(n, notifications);
              });
          });
      }
    }
  }, [notifications_data, notifications_isLoading]);

  useEffect(() => {
    if (!direct_notifications_isLoading) {
      if (
        direct_notifications_data &&
        direct_notifications_data.pages.length > 0
      ) {
        direct_notifications_data.pages
          .filter((p) => p.items.length > 0)
          .forEach((p) => {
            const notifs = p.items;
            notifs
              .filter((n) => {
                return !n.isSeen;
              })
              .forEach((n) => {
                setDirectNotifications(n, direct_notifications);
              });
          });
      }
    }
  }, [direct_notifications_data, direct_notifications_isLoading]);

  useEffect(() => {
    if (notifications.length > 0) {
      notifications
        .filter((n) => !n.isDisplayed)
        .forEach((n) => {
          const fileType = n.message?.fileUrl?.split(".").pop();
          const notificationMessage = !n.message?.fileUrl
            ? n.message.content
            : fileType !== "pdf"
            ? `${n.message?.member.profile.name} sent an Image`
            : `${n.message?.member.profile.name} sent a Documnent`;
          toast.message(notificationMessage, {
            icon: (
              <UserAvatar
                className="w-[30px] h-[30px] md:w-[30px] md:h-[30px]"
                src={n.message.member.profile.imageUrl}
              />
            ),
            action: {
              label: "View",
              onClick: () =>
                router.push(
                  `/servers/${params?.serverId}/channels/${n.channelId}`,
                  { scroll: false }
                ),
            },
            actionButtonStyle: {
              background: "rgb(99 102 241 / var(--tw-bg-opacity))",
              color: "white",
            },
            description: formatDistanceToNowStrict(n.createdAt, {
              addSuffix: true,
            }),
            descriptionClassName:
              "text-gray-400 dark:text-gray-300 flex items-center justify-start gap-2",
            important: true,
          });
          setDisplayNotif(n, notifications);
        });
      router.refresh();
    }
  }, [notifications]);
  useEffect(() => {
    if (direct_notifications.length > 0) {
      direct_notifications
        .filter((n) => !n.isDisplayed)
        .forEach((n) => {
          const fileType = n.directMessage?.fileUrl?.split(".").pop();
          const notificationMessage = !n.directMessage?.fileUrl
            ? n.directMessage.content
            : fileType !== "pdf"
            ? `${n.directMessage?.member.profile.name} sent an Image`
            : `${n.directMessage?.member.profile.name} sent a Documnent`;
          toast.message(notificationMessage, {
            icon: (
              <UserAvatar
                src={n.directMessage.member.profile.imageUrl}
                className="w-[30px] h-[30px] md:w-[30px] md:h-[30px]"
              />
            ),
            action: {
              label: "View",
              onClick: () =>
                router.push(
                  `/servers/${params?.serverId}/conversation/${n.directMessage.member.id}`,
                  { scroll: false }
                ),
            },
            actionButtonStyle: {
              background: "rgb(99 102 241 / var(--tw-bg-opacity))",
              color: "white",
            },
            description: formatDistanceToNowStrict(n.createdAt, {
              addSuffix: true,
            }),
            descriptionClassName:
              "text-gray-400 dark:text-gray-300 flex items-center justify-start gap-2",
            important: true,
          });
          setDirectDisplayNotif(n, direct_notifications);
        });
      router.refresh();
    }
  }, [direct_notifications]);

  return (
    <>
      {children}
      <Toaster
        pauseWhenPageIsHidden
        visibleToasts={3}
        theme={resolvedTheme as any}
        cn={(c) => cn("bg-[#e3e5e8] dark:bg-[#1e1f22] z-[1000] ", c)}
        position={isNotifBarOpen ? "top-left" : "top-right"}
        toastOptions={{
          classNames: {
            icon: "w-[30px] h-[30px]",
          },
        }}
      />
    </>
  );
};

export default NotficationProvider;
