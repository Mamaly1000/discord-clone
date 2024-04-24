import { QueryFunction, useInfiniteQuery } from "@tanstack/react-query";

import qs from "query-string";
import { useParams } from "next/navigation";

import { useSocket } from "@/providers/SocketProvider";

interface props {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

const useChatQuery = ({ apiUrl, paramKey, paramValue, queryKey }: props) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
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
  type qf = QueryFunction<unknown, string[], any> | undefined;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages as qf,
      getNextPageParam: (lastPage) => (lastPage as any)?.nextCursor! as any,
      refetchInterval: isConnected ? 1000 : false,
      initialPageParam: undefined,
    });

  return { data, fetchNextPage, hasNextPage, isFetchingNextPage, status };
};
export default useChatQuery;
