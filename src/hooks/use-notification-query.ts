import { useInfiniteQuery } from "@tanstack/react-query";

import qs from "query-string";

import { safeNotificationType } from "@/types";

interface props {
  limit?: number;
  serverId?: string;
  channelId?: string;
}

const useNotificationQuery = (params?: props) => {
  const fetchNotifications = async ({
    pageParam = undefined,
  }: {
    pageParam?: string;
  }): Promise<{ items: safeNotificationType[]; nextCursor: null | string }> => {
    const url = qs.stringifyUrl(
      {
        url: `/api/notification`,
        query: {
          cursor: pageParam,
          limit: params?.limit,
          channelId: params?.channelId,
          serverId: params?.serverId,
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
    queryKey: [
      `/api/notification`,
      params?.channelId,
      params?.serverId,
      params?.limit,
    ],
    queryFn: (params) => fetchNotifications({ pageParam: params.pageParam }),
    getNextPageParam: (lastPage: { nextCursor: null | string }) =>
      lastPage?.nextCursor,
    refetchInterval: 5000,
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
export default useNotificationQuery;
