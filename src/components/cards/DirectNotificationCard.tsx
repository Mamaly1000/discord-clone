"use client";
import { useNotifBar } from "@/hooks/use-notification-bar-store";
import { safeDirectNotification } from "@/types";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import UserAvatar from "../common/UserAvatar";
import { Clock } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { Button } from "../ui/button";

const DirectNotificationCard = ({
  notif,
  handler,
}: {
  handler: () => void;
  notif: safeDirectNotification;
}) => {
  const router = useRouter();
  const params = useParams();
  const { onChange } = useNotifBar();
  const onClick = () => {
    router.push(
      `/servers/${params?.serverId}/conversation/${notif.directMessage.memberId}`,
      {
        scroll: false,
      }
    );
    router.refresh();
    handler();
    onChange(false);
  };

  const fileType = notif.directMessage?.fileUrl?.split(".").pop();
  const notificationMessage = !notif.directMessage?.fileUrl
    ? notif.directMessage.content
    : fileType !== "pdf"
    ? `${notif.directMessage?.member.profile.name} sent an Image`
    : `${notif.directMessage?.member.profile.name} sent a Documnent`;
  return (
    <article className="flex items-start justify-start gap-3 p-3 w-full max-w-full overflow-hidden">
      <UserAvatar
        className="w-[30px] h-[30px]"
        src={notif.directMessage.member.profile.imageUrl}
      />
      <div className="min-w-[calc(100%-24px)] max-w-[calc(100%-24px)] flex items-start justify-start gap-2 flex-col">
        <div className="flex items-start flex-wrap justify-start gap-1 line-clamp-1">
          <p className="text-[15px] line-clamp-1 font-semibold capitalize text-black dark:text-white ">
            {notif.directMessage.member.profile.name}
          </p>
          <p className="w-full text-left flex items-center gap-1 capitalize text-[12px] text-neutral-500 dark:text-neutral-400">
            <Clock className="w-3 h-3" />
            {formatDistanceToNowStrict(notif.createdAt, { addSuffix: true })}
          </p>
        </div>
        <p className="text-[13px] text-neutral-500 dark:text-neutral-200 capitalize">
          {notificationMessage}
        </p>
        <Button onClick={onClick} className="w-auto" variant={"primary"}>
          view
        </Button>
      </div>
    </article>
  );
};

export default DirectNotificationCard;
