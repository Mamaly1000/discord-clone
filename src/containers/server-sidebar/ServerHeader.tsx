"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Server_Members_Profiles_channels } from "@/types";
import { MemberRole } from "@prisma/client";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import React, { FC } from "react";

interface props {
  server: Server_Members_Profiles_channels;
  role?: MemberRole;
}

const ServerHeader: FC<props> = ({ server, role }) => {
  const isADMIN = role === MemberRole.ADMIN;
  const isMODERATOR = isADMIN || role === MemberRole.MODERATOR;
  const isGUEST = role === MemberRole.GUEST;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none " asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition  capitalize">
          {server.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]  capitalize">
        {isMODERATOR && (
          <DropdownMenuItem className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer flex items-center justify-between">
            Invite people <UserPlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isADMIN && (
          <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer flex items-center justify-between">
            server setting <Settings className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isADMIN && (
          <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer flex items-center justify-between">
            manage members <Users className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isMODERATOR && (
          <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer flex items-center justify-between">
            create channel <PlusCircle className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isMODERATOR && <DropdownMenuSeparator />}
        {isADMIN && (
          <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer flex items-center justify-between text-rose-500 ">
            delete server <Trash className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isADMIN && (
          <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer flex items-center justify-between text-rose-500 ">
            leave server <LogOut className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
