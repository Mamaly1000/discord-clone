"use client";
import { useSocket } from "@/providers/SocketProvider";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";

const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge
        variant={"outline"}
        className="bg-yellow-600 text-white border-none w-6 h-6 md:h-auto md:w-auto p-1 md:p-2"
      >
        <ArrowUpDown className="w-4 h-4 md:hidden" />
        <span className="hidden md:block">Fallback : Polling in every 1s</span>
      </Badge>
    );
  }
  return (
    <Badge
      variant={"outline"}
      className="bg-emerald-600 text-white border-none w-6 h-6 md:h-auto md:w-auto p-1 md:p-2"
    >
      <ArrowUpDown className="w-4 h-4 md:hidden" />
      <span className="hidden md:block">Live: Real-time updates</span>
    </Badge>
  );
};

export default SocketIndicator;
