import MediaRoom from "@/components/media-room";
import ChatHeader from "@/containers/chat/ChatHeader";
import ChatInput from "@/containers/chat/ChatInput";
import ChatMessagesContainer from "@/containers/chat/ChatMessagesContainer";
import { GET_OR_CREATE_CONVERSATION } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/prisma";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const ConversationPage = async ({
  params,
  searchParams,
}: {
  searchParams: { video?: boolean };
  params: { serverId: string; memberId: string };
}) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });
  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await GET_OR_CREATE_CONVERSATION(
    currentMember.id,
    params.memberId
  );
  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }
  const { memberOne, memberTwo } = conversation;
  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col min-h-screen h-full min-w-full   items-start justify-start">
      <ChatHeader
        name={otherMember.profile.name}
        serverId={params.serverId}
        type="conversation"
        imageUrl={otherMember.profile.imageUrl}
      />
      {searchParams.video ? (
        <MediaRoom chatId={conversation.id} audio={true} video={true} />
      ) : (
        <>
          <ChatMessagesContainer
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
              serverId: currentMember.serverId,
            }}
          />
          <ChatInput
            name={otherMember.profile.name}
            apiUrl="/api/socket/direct-messages"
            type="conversation"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  );
};

export default ConversationPage;
