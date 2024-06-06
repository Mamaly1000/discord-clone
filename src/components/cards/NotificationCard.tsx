"use client";
import { safeNotificationType } from "@/types";
import React from "react";
import UserAvatar from "../common/UserAvatar";
import { Clock, Hash } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import CustomTooltip from "../common/action-tooltip"; 
import { useParams, useRouter } from "next/navigation";
import { useNotifBar } from "@/hooks/use-notification-bar-store";

const NotificationCard = ({
  notif,
  handler,
}: {
  handler: () => void;
  notif: safeNotificationType;
}) => {
  const router = useRouter();
  const params = useParams();
  const { onChange } = useNotifBar();
  const onClick = () => {
    router.push(`/servers/${params?.serverId}/channels/${notif.channelId}`, {
      scroll: false,
    });
    router.refresh();
    handler();
    onChange(false);
  };

  const fileType = notif.message?.fileUrl?.split(".").pop();
  const notificationMessage = !notif.message?.fileUrl
    ? notif.message.content
    : fileType !== "pdf"
    ? `${notif.message?.member.profile.name} sent an Image`
    : `${notif.message?.member.profile.name} sent a Documnent`;
  return (
    <article
      onClick={onClick}
      className="flex items-start justify-start gap-3 p-3 pr-8 w-full max-w-full overflow-hidden cursor-pointer hover:bg-zinc-400/20 transition-all"
    >
      <UserAvatar
        className="w-[30px] h-[30px]"
        src={notif.message.member.profile.imageUrl}
      />
      <div className="min-w-[calc(100%-24px)] max-w-[calc(100%-24px)] flex items-start justify-start gap-2 flex-col">
        <div className="flex items-start flex-wrap justify-start">
          <p className="text-[14px] line-clamp-1 font-semibold capitalize text-black dark:text-white ">
            {notif.message.member.profile.name}
          </p>
          <CustomTooltip
            align="center"
            label={notif.channel.name}
            side="bottom"
          >
            <div className="px-2 ml-auto py-1 text-[13px] max-w-[50%] rounded-full bg-gray-600 text-white flex items-center justify-center gap-1">
              <Hash className="min-w-4 min-h-4 max-w-4 max-h-4" />
              <p className="line-clamp-1">{notif.channel.name}</p>
            </div>
          </CustomTooltip>
          <p className="w-full text-left flex items-center gap-1 capitalize text-[12px] text-neutral-500 dark:text-neutral-400">
            <Clock className="w-3 h-3" />
            {formatDistanceToNowStrict(notif.createdAt, { addSuffix: true })}
          </p>
        </div>
        <p className="text-[13px] text-neutral-500 dark:text-neutral-200 capitalize">
          {notificationMessage}
        </p>
      </div>
    </article>
  );
};

export default NotificationCard;
