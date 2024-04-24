"use client";
import MessageCard from "@/components/cards/MessageCard";
import ChatWellcome from "@/components/common/ChatWellcome";
import Error from "@/components/ui/Error";
import Loader from "@/components/ui/Loader";
import useChatQuery from "@/hooks/use-chat-query";
import { Member } from "@prisma/client";
import React, { FC, Fragment } from "react";
import { format } from "date-fns";

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

const date_format = `d MMM yyyy, HH:mm`;

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
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    status,
  } = useChatQuery({
    queryKey: `chat:${chatId}`,
    apiUrl,
    paramKey,
    paramValue,
  });
  if (isLoading) {
    return <Loader message="Loading messages..." />;
  }
  if (status === "error") {
    return <Error message="Something went wrong!" />;
  }
  return (
    <div className="flex-1 w-full flex flex-col p-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWellcome type={type} name={name} />
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message, i) => (
              <MessageCard
                deleted={message.deleted}
                currentMember={member}
                message={message}
                key={message.id}
                socketQuery={socketQuery}
                socketUrl={socketUrl}
                isUpdated={message.updatedAt !== message.createdAt}
                index={i}
                timeStamp={format(new Date(message.createdAt), date_format)}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChatMessagesContainer;
