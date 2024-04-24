import { safeMessageType } from "@/types";
import { Member, MemberRole, Message, Profile } from "@prisma/client";
import React, { FC, ReactNode } from "react";
import UserAvatar from "../common/UserAvatar";
import CustomTooltip from "../common/action-tooltip";
import { iconMap } from "../common/icons";

interface props {
  message: safeMessageType;
  index: number;
  deleted?: boolean;
  currentMember: Member;
  isUpdated?: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
  timeStamp: string;
}

const MessageCard: FC<props> = ({
  index,
  message,
  currentMember,
  socketQuery,
  socketUrl,
  deleted,
  isUpdated,
  timeStamp,
}) => {
  const isADMIN = message.member.role === MemberRole.ADMIN;
  const isMODERATOR = isADMIN || message.member.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === message.member.id;
  const canDelete = !deleted && (isADMIN || isMODERATOR || isOwner);
  const canEdit = !deleted && isOwner && !message.fileUrl;
  const isPDF = message.fileUrl?.split(".").pop() === "pdf";

  return (
    <article className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={message.member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="font-semibold text-sm hover:underline cursor-pointer">
                {message.member.profile.name}
              </p>
              <CustomTooltip
                align="center"
                label={message.member.role}
                side="top"
              >
                {(iconMap as any)[message.member.role]}
              </CustomTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timeStamp}
            </span>
          </div>
          {message.content}
        </div>
      </div>
    </article>
  );
};

export default MessageCard;
