"use client";
import { Member, MemberRole, Profile } from "@prisma/client";
import React, { FC } from "react";
import UserAvatar from "../common/UserAvatar";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
} from "@/components/ui/dropdown-menu";
import { roleIcon } from "../common/icons";

interface props {
  member: Member & { profile: Profile };
  index: number;
  displayActions?: boolean;
  isLoading?: boolean;
  onRoleChange: (memberId: string, selectedRole: MemberRole) => Promise<void>;
  onKick: (memberId: string) => Promise<void>;
}

const MemberItem: FC<props> = ({
  member,
  displayActions,
  isLoading,
  onRoleChange,
  onKick,
}) => {
  return (
    <div className="flex items-center gap-x-2 mb-6">
      <UserAvatar src={member?.profile?.imageUrl} />
      <div className="flex flex-col gap-y-1">
        <div className="text-xs font-semibold flex items-center gap-x-1 ">
          {member.profile.name}
          {roleIcon[member.role]}
        </div>
        <p className="text-xs text-zinc-500">{member.profile.email}</p>
      </div>
      {displayActions && (
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical className="w-4 h-4 text-zinc-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="left">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex items-center">
                  <ShieldQuestion className="w-4 h-4 mr-2" />
                  <span>role</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      disabled={member.role === "GUEST"}
                      onClick={() => onRoleChange(member.id, "GUEST")}
                      className="capitalize"
                    >
                      <Shield className="w-4 h-4 mr-2" /> guest{" "}
                      {member.role === "GUEST" && (
                        <Check className="w-4 h-4 ml-auto" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={member.role === "MODERATOR"}
                      onClick={() => onRoleChange(member.id, "MODERATOR")}
                      className="capitalize"
                    >
                      <ShieldCheck className="w-4 h-4 mr-2" /> Moderator{" "}
                      {member.role === "MODERATOR" && (
                        <Check className="w-4 h-4 ml-auto" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onKick(member.id)}
                className="text-rose-500"
              >
                <Gavel className="w-4 h-4 mr-2" /> kick
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      {isLoading && (
        <Loader2 className="w-4 h-4 animate-spin text-zinc-500 ml-auto " />
      )}
    </div>
  );
};

export default MemberItem;
