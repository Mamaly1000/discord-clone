"use client";
import { useSocket } from "@/providers/SocketProvider";
import React from "react";
import { Badge } from "@/components/ui/badge";

const SocketIndicator = () => {
  const { isConnected, socket } = useSocket();

  if (!isConnected) {
    return (
      <Badge
        variant={"outline"}
        className="bg-yellow-600 text-white border-none"
      >
        Fallback : Polling in every 1s
      </Badge>
    );
  }
  return (
    <Badge
      variant={"outline"}
      className="bg-emerald-600 text-white border-none"
    >
      Live: Real-time updates
    </Badge>
  );
};

export default SocketIndicator;
