"use client";
import React, { FC, Fragment, useRef, ElementRef } from "react";
import MessageCard from "@/components/cards/MessageCard";
import ChatWellcome from "@/components/common/ChatWellcome";
import Error from "@/components/ui/Error";
import Loader from "@/components/ui/Loader";
import useChatQuery from "@/hooks/use-chat-query";
import { Member } from "@prisma/client";
import { format } from "date-fns";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import useNotificationQuery from "@/hooks/use-notification-query";
import useDirectNotificationQuery from "@/hooks/use-direct-notification-query";

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
  const queryKey = `chat:${chatId}`;
  const updateKey = `chat:${chatId}:messages:update`;
  const addKey = `chat:${chatId}:messages`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const buttomRef = useRef<ElementRef<"div">>(null);

  const { data: notifications_data } = useNotificationQuery({
    serverId: socketQuery?.serverId,
  });
  const notifications =
    notifications_data?.pages.map((p) => p.items.map((n) => n)).flat() || [];

  const { data: direct_notifications_data } = useDirectNotificationQuery({
    serverId: socketQuery?.serverId,
  });
  const direct_notifications =
    direct_notifications_data?.pages.map((p) => p.items.map((n) => n)).flat() ||
    [];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    status,
  } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
    serverId: socketQuery?.serverId,
  });

  useChatSocket({ addKey, queryKey, updateKey });
  useChatScroll({
    chatRef,
    buttomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  if (isLoading || status === "pending") {
    return <Loader message="Loading messages..." />;
  }
  if (status === "error") {
    return <Error message="Something went wrong!" />;
  }

  return (
    <div
      ref={chatRef}
      className="flex-1 w-full flex flex-col p-4 overflow-y-auto"
    >
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWellcome type={type} name={name} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader message="load previous messages..." />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 my-4 transition"
            >
              load previous messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => {
          return (
            <Fragment key={i}>
              {group.items.map((message, i) => {
                let IsMessageSeen = false;
                let isInNotification = false;
                if (type === "channel") {
                  IsMessageSeen = !!notifications.find(
                    (n) => n.message.id === message.id
                  )?.isSeen;
                  isInNotification = !!notifications.find(
                    (n) => n.message.id === message.id
                  );
                }
                if (type === "conversation") {
                  IsMessageSeen = !!direct_notifications.find(
                    (n) => n.directMessage.id === message.id
                  )?.isSeen;
                  isInNotification = !!direct_notifications.find(
                    (n) => n.directMessage.id === message.id
                  );
                }
                return (
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
                    IsMessageSeen={IsMessageSeen}
                    isInNotification={isInNotification}
                  />
                );
              })}
            </Fragment>
          );
        })}
      </div>
      <div ref={buttomRef} />
    </div>
  );
};

export default ChatMessagesContainer;
