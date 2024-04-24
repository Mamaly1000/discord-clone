import React from "react";
import ChatHeader from "@/containers/chat/ChatHeader";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/prisma";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ChatInput from "@/containers/chat/ChatInput";
import ChatMessagesContainer from "@/containers/chat/ChatMessagesContainer";

const ChannelPage = async ({
  params,
}: {
  params: { serverId: string; channelId: string };
}) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: { id: params.channelId },
  });
  const member = await db.member.findFirst({
    where: { profileId: profile.id, serverId: params.serverId },
  });

  if (!channel || !member) {
    return redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col min-h-screen h-full min-w-full   items-start justify-start">
      <ChatHeader
        name={channel.name}
        serverId={params.serverId}
        type="channel"
      />
      <ChatMessagesContainer
        socketUrl="/api/socket/messages"
        apiUrl="/api/messages"
        name={channel.name}
        member={member}
        type="channel"
        socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
        paramKey="channelId"
        paramValue={channel.id}
        chatId={channel.id}
      />
      <ChatInput
        name={channel.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
      />
    </div>
  );
};

export default ChannelPage;
