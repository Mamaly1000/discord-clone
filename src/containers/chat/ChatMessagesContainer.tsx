"use client";
import ChatWellcome from "@/components/common/ChatWellcome";
import { Member } from "@prisma/client";
import React, { FC } from "react";

interface props {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

const ChatMessagesContainer: FC<props> = ({
  apiUrl,
  chatId,
  member,
  name,
  paramKey,
  paramValue,
  socketQuery,
  socketUrl,
  type,
}) => {
  return (
    <div className="flex-1 w-full flex flex-col p-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWellcome type={type} name={name}  />
    </div>
  );
};

export default ChatMessagesContainer;
