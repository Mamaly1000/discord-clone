import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/prisma";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import ServerHeader from "./ServerHeader";

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

  const textChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const AudioChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const members = server.members.filter((m) => m.profileId !== profile.id);

  const myRole = server.members.find((m) => m.profileId === profile.id)?.role;

  return (
    <section className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5] ">
      <ServerHeader server={server} role={myRole} />
    </section>
  );
};

export default ServerSidebar;
