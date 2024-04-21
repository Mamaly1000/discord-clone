import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/prisma";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import ServerHeader from "./ServerHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import ServerSearch from "./ServerSearch";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

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

  const iconMap = {
    [ChannelType.TEXT]: <Hash className="w-4 h-4 mr-2" />,
    [ChannelType.AUDIO]: <Mic className="w-4 h-4 mr-2" />,
    [ChannelType.VIDEO]: <Video className="w-4 h-4 mr-2" />,
  };
  const roleIcon = {
    GUEST: null,
    MODERATOR: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
    ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500 mr-2" />,
  };

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
        </div>
      </ScrollArea>
    </section>
  );
};

export default ServerSidebar;
