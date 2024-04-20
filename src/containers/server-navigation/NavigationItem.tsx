"use client";
import CustomTooltip from "@/components/common/action-tooltip";
import { cn } from "@/lib/utils";
import { Server } from "@prisma/client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { FC } from "react";
interface props {
  server: Server;
  index: number;
  className?: string;
}
const NavigationItem: FC<props> = ({ server, index, className }) => {
  const params = useParams();
  const router = useRouter();
  const isActive = params?.serverId === server.id;
  const onClick = () => {
    if (!isActive) {
      router.push(`/servers/${server.id}`);
    }
  };
  return (
    <CustomTooltip align="center" label={server.name} side="right">
      <button
        className={cn("group relative flex items-center", className)}
        onClick={onClick}
      >
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            isActive ? "h-[36px]" : "h-[8px] group-hover:h-[20px]"
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] drop-shadow-2xl rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden aspect-video",
            isActive && "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image
            fill
            src={server.imageUrl}
            alt={server.name}
            className="object-cover"
          />
        </div>
      </button>
    </CustomTooltip>
  );
};

export default NavigationItem;
