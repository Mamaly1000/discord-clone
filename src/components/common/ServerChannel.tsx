"use client";
import { cn } from "@/lib/utils";
import { Channel, MemberRole, Server } from "@prisma/client";
import React, { FC } from "react";
import { iconMapRaw } from "./icons";
import { useParams, useRouter } from "next/navigation";
import CustomTooltip from "./action-tooltip";
import { Edit, Lock, Trash } from "lucide-react";
import { ModalType, useModal } from "@/hooks/use-modal-store";

interface props {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const ServerChannel: FC<props> = ({ channel, server, role }) => {
  const { onOpen } = useModal();

  const Icon = iconMapRaw[channel.type];
  const router = useRouter();
  const params = useParams();

  const onClick = () => {
    if (params?.channelId !== channel.id || !!!params?.channelId)
      router.push(`/servers/${params?.serverId}/channels/${channel?.id}`);
  };
  const onAction = (e: React.MouseEvent, type: ModalType) => {
    e.stopPropagation();
    onOpen({
      type,
      data: { channel, server },
    });
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <Icon className="flex-shrink-0  w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>
      {channel.name.toLowerCase() !== "general" &&
        role !== MemberRole.GUEST && (
          <div className="ml-auto flex items-center gap-x-2">
            <CustomTooltip label="Edit" align="center" side="top">
              <Edit
                onClick={(e) => onAction(e, "edit-channel")}
                className="w-4 h-4 hidden group-hover:block cursor-pointer text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              />
            </CustomTooltip>
            <CustomTooltip label="Delete" align="center" side="top">
              <Trash
                onClick={(e) => onAction(e, "delete-channel")}
                className="w-4 h-4 hidden group-hover:block cursor-pointer hover:text-zinc-600 dark:text-rose-500 text-rose-500 dark:hover:text-zinc-300 transition"
              />
            </CustomTooltip>
          </div>
        )}
      {channel.name.toLowerCase() === "general" && (
        <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  );
};

export default ServerChannel;
