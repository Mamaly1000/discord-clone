"use client";

import { Member, MemberRole, Profile, Server } from "@prisma/client";
import React, { FC } from "react";
import { roleIcon } from "./icons";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import UserAvatar from "./UserAvatar";
interface props {
  member: Member & { profile: Profile };
  server: Server;
  role?: MemberRole;
}
const ServerMember: FC<props> = ({ member }) => {
  const router = useRouter();
  const params = useParams();

  const icon = roleIcon[member.role];
  const isActive = params?.memberId === member.id;
  return (
    <button
      onClick={() =>
        router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
      }
      className={cn(
        "group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        isActive && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar
        src={member.profile.imageUrl}
        className="h-8 w-8 md:h-8 md:w-8"
      />
      <p
        className={cn(
          "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          isActive &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};

export default ServerMember;
