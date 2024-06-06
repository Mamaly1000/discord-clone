"use client";
import React from "react";
import { Button } from "./button";
import { Bell } from "lucide-react";
import { useNotifBar } from "@/hooks/use-notification-bar-store";
import { useServerNavigation } from "@/hooks/use-server-navigation";

const NotifBell = () => {
  const { onChange } = useNotifBar();
  const { onChange: onServerChange } = useServerNavigation();

  return (
    <Button
      variant="outline"
      className="w-[48px] h-[48px] bg-transparent border-0 "
      size="icon"
      onClick={() => {
        onServerChange(false);
        onChange(true);
      }}
    >
      <Bell className="h-[1.2rem] w-[1.2rem] " />
    </Button>
  );
};

export default NotifBell;
