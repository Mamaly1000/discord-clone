import ChatVideoButton from "@/components/chat-video-button";
import MobileToggle from "@/components/common/mobile-toggle";
import SocketIndicator from "@/components/common/SocketIndicator";
import UserAvatar from "@/components/common/UserAvatar";
import { Hash } from "lucide-react";
import React, { FC } from "react";

interface props {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

const ChatHeader: FC<props> = ({ imageUrl, name, serverId, type }) => {
  return (
    <section className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2  ">
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <Hash className="w-5 h-5 mr-2 text-zinc-500 dark:text-zinc-400" />
      )}
      {type === "conversation" && (
        <UserAvatar src={imageUrl} className="w-8 h-8 md:w-8 md:h-8 mr-2 " />
      )}
      <p className="font-semibold text-md text-black dark:text-white  capitalize">
        {name}
      </p>
      <div className="ml-auto flex items-center">
        {type === "conversation" && <ChatVideoButton />}
        <SocketIndicator />
      </div>
    </section>
  );
};

export default ChatHeader;
