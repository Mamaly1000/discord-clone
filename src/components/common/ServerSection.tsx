"use client";
import { Server_Members_Profiles_channels } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import React, { FC } from "react";
import CustomTooltip from "./action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
interface props {
  label: string;
  role: MemberRole;
  sectionType: "channel" | "member";
  channelType?: ChannelType;
  server?: Server_Members_Profiles_channels;
  hasNotification?: boolean;
}
const ServerSection: FC<props> = ({
  label,
  role,
  sectionType,
  server,
  channelType,
  hasNotification = false,
}) => {
  const { onOpen } = useModal();
  return (
    <section className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>

      {role !== MemberRole.GUEST && sectionType === "channel" && (
        <CustomTooltip label="Create Channel" side="top" align="center">
          <button
            onClick={() =>
              onOpen({
                type: "manage-channels",
                data: { server, channel: { type: channelType } },
              })
            }
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </CustomTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === "member" && (
        <CustomTooltip label="Manage Members" side="top" align="center">
          <button
            onClick={() => onOpen({ type: "manage-members", data: { server } })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Settings className="w-4 h-4" />
          </button>
        </CustomTooltip>
      )}
    </section>
  );
};

export default ServerSection;
