import { useInfiniteQuery } from "@tanstack/react-query";

import qs from "query-string";

import { useSocket } from "@/providers/SocketProvider";
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
  }: {
    pageParam?: string;
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
    queryFn: (params) => fetchMessages({ pageParam: params.pageParam }),
    getNextPageParam: (lastPage: { nextCursor: null | string }) =>
      lastPage?.nextCursor,
    refetchInterval: !isConnected ? 1000 : false,
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
