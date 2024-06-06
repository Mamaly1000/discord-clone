import { useInfiniteQuery } from "@tanstack/react-query";

import qs from "query-string";

import { safeDirectNotification } from "@/types";

interface props {
  limit?: number;
  serverId?: string;
  memberId?: string;
  startDate?: Date;
  endDate?: Date;
  conversationId?: string;
}

const useDirectNotificationQuery = (params?: props) => {
  const fetchNotifications = async ({
    pageParam = undefined,
  }: {
    pageParam?: string;
  }): Promise<{
    items: safeDirectNotification[];
    nextCursor: null | string;
  }> => {
    const url = qs.stringifyUrl(
      {
        url: `/api/direct-notification`,
        query: {
          cursor: pageParam,
          limit: params?.limit,
          memberId: params?.memberId,
          serverId: params?.serverId,
          conversationId: params?.conversationId,
          startDate: params?.startDate?.toISOString(),
          endDate: params?.endDate?.toISOString(),
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
    refetch,
  } = useInfiniteQuery({
    queryKey: [
      `/api/direct-notification`,
      params?.memberId,
      params?.serverId,
      params?.limit,
      params?.startDate,
      params?.endDate,
      params?.conversationId,
    ],
    queryFn: (params) => fetchNotifications({ pageParam: params.pageParam }),
    getNextPageParam: (lastPage: { nextCursor: null | string }) =>
      lastPage?.nextCursor,
    refetchInterval: 5000,
    initialPageParam: undefined,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
    refetch,
  };
};
export default useDirectNotificationQuery;
