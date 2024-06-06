"use client";
import React from "react";
import { Button } from "./button";
import { Bell } from "lucide-react";
import { useNotifBar } from "@/hooks/use-notification-bar-store";
import { useServerNavigation } from "@/hooks/use-server-navigation";
import { useParams } from "next/navigation";
import useNotificationQuery from "@/hooks/use-notification-query";
import useDirectNotificationQuery from "@/hooks/use-direct-notification-query";

const NotifBell = () => {
  const params = useParams();
  const serverId = params?.serverId as string;

  const { data: notifications_data, isLoading: notif_loading } =
    useNotificationQuery({ serverId });
  const {
    data: direct_notifications_data,
    isLoading: direct_notification_loading,
  } = useDirectNotificationQuery({
    serverId,
  });

  const isLoading = notif_loading || direct_notification_loading;

  const notifications =
    notifications_data?.pages.map((p) => p.items).flat() || [];
  const directNotifications =
    direct_notifications_data?.pages.map((p) => p.items).flat() || [];

  const { onChange } = useNotifBar();
  const { onChange: onServerChange } = useServerNavigation();

  return (
    <Button
      variant="outline"
      className="w-[48px] h-[48px] bg-transparent border-0  relative"
      size="icon"
      onClick={() => {
        onServerChange(false);
        onChange(true);
      }}
    >
      {((!isLoading && notifications.length > 0) ||
        directNotifications.length > 0) && (
        <div className="min-w-[10px] min-h-[10px] animate-pulse bg-indigo-500 rounded-full drop-shadow-2xl absolute top-3 right-3"></div>
      )}
      <Bell className="h-[1.2rem] w-[1.2rem] " />
    </Button>
  );
};

export default NotifBell;
