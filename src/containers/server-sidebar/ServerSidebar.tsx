import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/prisma";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import ServerHeader from "./ServerHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import ServerSearch from "./ServerSearch";
import { Separator } from "@/components/ui/separator";
import ServerSection from "@/components/common/ServerSection";
import ServerChannel from "@/components/common/ServerChannel";
import { iconMap, roleIcon } from "@/components/common/icons";
import ServerMember from "@/components/common/ServerMember";

const ServerSidebar = async ({ serverId }: { serverId: string }) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }
  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: { some: { profileId: profile.id } },
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: { role: "asc" },
      },
    },
  });
  if (!server) {
    return redirect("/");
  }

  const notifications =
    (await db.notification.findMany({
      where: {
        profileId: profile.id,
        serverId: server.id,
        isSeen: false,
      },
    })) || [];

  const directNotifications =
    (await db.directNotification.findMany({
      where: {
        serverId: server.id,
        profileId: profile.id,
        isSeen: false,
      },
      include: {
        directMessage: { include: { member: true } },
      },
    })) || [];

  const TextChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const AudioChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const VideoChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const members = server.members.filter((m) => m.profileId !== profile.id);

  const myRole = server.members.find((m) => m.profileId === profile.id)?.role;

  return (
    <section className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5] ">
      <ServerHeader server={server} role={myRole} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "text channels",
                type: "channel",
                data: TextChannels.map((c) => ({
                  id: c.id,
                  name: c.name,
                  icon: iconMap[c.type],
                })),
              },
              {
                label: "voice channels",
                type: "channel",
                data: AudioChannels.map((c) => ({
                  id: c.id,
                  name: c.name,
                  icon: iconMap[c.type],
                })),
              },
              {
                label: "video channels",
                type: "channel",
                data: VideoChannels.map((c) => ({
                  id: c.id,
                  name: c.name,
                  icon: iconMap[c.type],
                })),
              },
              {
                label: "members",
                type: "member",
                data: members.map((m) => ({
                  id: m.id,
                  name: m.profile.name,
                  icon: roleIcon[m.role],
                })),
              },
            ]}
          />
          <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
          {!!TextChannels.length && (
            <div className="mb-2">
              <ServerSection
                server={server}
                label="Text Channels"
                sectionType="channel"
                channelType="TEXT"
                role={myRole as MemberRole}
              />
              <div className="space-y-[2px]">
                {TextChannels.map((channel) => (
                  <ServerChannel
                    role={myRole}
                    server={server}
                    channel={channel}
                    key={channel.id}
                    hasNotification={
                      !!notifications.find((n) => n.channelId === channel.id)
                    }
                  />
                ))}
              </div>
            </div>
          )}
          {!!AudioChannels.length && (
            <div className="mb-2">
              <ServerSection
                server={server}
                label="Voice Channels"
                sectionType="channel"
                channelType="AUDIO"
                role={myRole as MemberRole}
              />
              <div className="space-y-[2px]">
                {AudioChannels.map((channel) => (
                  <ServerChannel
                    role={myRole}
                    server={server}
                    channel={channel}
                    key={channel.id}
                    hasNotification={
                      !!notifications.find((n) => n.channelId === channel.id)
                    }
                  />
                ))}
              </div>
            </div>
          )}
          {!!VideoChannels.length && (
            <div className="mb-2">
              <ServerSection
                server={server}
                label="Video Channels"
                sectionType="channel"
                channelType="VIDEO"
                role={myRole as MemberRole}
              />
              <div className="space-y-[2px]">
                {VideoChannels.map((channel) => (
                  <ServerChannel
                    role={myRole}
                    server={server}
                    channel={channel}
                    key={channel.id}
                    hasNotification={
                      !!notifications.find((n) => n.channelId === channel.id)
                    }
                  />
                ))}
              </div>
            </div>
          )}
          {!!members.length && (
            <div className="mb-2">
              <ServerSection
                server={server}
                label="Members"
                sectionType="member"
                role={myRole as MemberRole}
              />
              <div className="space-y-[2px]">
                {members.map((member) => (
                  <ServerMember
                    server={server}
                    role={myRole}
                    member={member}
                    key={member.id}
                    hasNotification={
                      !!directNotifications.find(
                        (n) => n.directMessage.member.id === member.id
                      )
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </section>
  );
};

export default ServerSidebar;
