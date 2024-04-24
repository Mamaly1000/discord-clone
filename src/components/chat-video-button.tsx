"use client";
import React from "react";
import qs from "query-string";
import {
  useRouter,
  useParams,
  useSearchParams,
  usePathname,
} from "next/navigation";

import { Video, VideoOff } from "lucide-react";

import CustomTooltip from "@/components/common/action-tooltip";

const ChatVideoButton = () => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const isVideo = searchParams?.get("video");

  const Icon = !isVideo ? Video : VideoOff;
  const tooltipPanel = !isVideo ? "Start video call" : "End video call";

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    );
    router.push(url);
  };

  return (
    <CustomTooltip align="center" label={tooltipPanel} side="bottom">
      <button onClick={onClick} className="transition mr-4 hover:opacity-75">
        <Icon className="w-6 h-6 text-zinc-500 dark:text-zinc-400 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
      </button>
    </CustomTooltip>
  );
};

export default ChatVideoButton;
