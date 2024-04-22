import React from "react";
import ChatHeader from "@/containers/chat/ChatHeader";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/prisma";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

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
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full min-w-full items-start justify-start">
      <ChatHeader
        name={channel.name}
        serverId={params.serverId}
        type="channel"
      />
    </div>
  );
};

export default ChannelPage;
