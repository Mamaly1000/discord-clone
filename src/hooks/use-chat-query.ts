import { useInfiniteQuery } from "@tanstack/react-query";

import qs from "query-string";

import { useSocket } from "@/providers/SocketProvider";
import { Message } from "@prisma/client";
import { safeMessageType } from "@/types";

interface props {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

const useChatQuery = ({ apiUrl, paramKey, paramValue, queryKey }: props) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({
    pageParam = undefined,
  }): Promise<{ items: safeMessageType[]; nextCursor: null | string }> => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    );

    const res = await fetch(url);
    return res.json();
  };
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage: {
      items: safeMessageType[];
      nextCursor: null | string;
    }) => lastPage?.nextCursor! as any,
    refetchInterval: isConnected ? 1000 : false,
    initialPageParam: undefined,
  });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
  };
};
export default useChatQuery;
