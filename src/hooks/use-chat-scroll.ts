import { RefObject, useEffect, useState } from "react";

type ChatScrollProps = {
  chatRef: RefObject<HTMLDivElement>;
  buttomRef: RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
};

export const useChatScroll = ({
  buttomRef,
  chatRef,
  count,
  loadMore,
  shouldLoadMore,
}: ChatScrollProps) => {
  const [hasInitialized, setInitialized] = useState(false);
  useEffect(() => {
    const topDiv = chatRef?.current;

    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;
      if (scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };
    topDiv?.addEventListener("scroll", handleScroll);
    return () => {
      topDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [shouldLoadMore, loadMore, chatRef]);
  useEffect(() => {
    const bottomDiv = buttomRef?.current;
    const topDiv = chatRef?.current;

    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setInitialized(true);
        return true;
      }
      if (!topDiv) {
        return false;
      }

      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

      return distanceFromBottom <= 100;
    };
    if (shouldAutoScroll()) {
      setTimeout(() => {
        buttomRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
    bottomDiv?.addEventListener("scroll", shouldAutoScroll);
    return () => {
      bottomDiv?.removeEventListener("scroll", shouldAutoScroll);
    };
  }, [hasInitialized, buttomRef, chatRef, count]);
};
