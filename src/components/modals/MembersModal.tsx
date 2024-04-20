"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Server_Members_Profiles_channels } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import MemberItem from "../cards/MemberItem";
import { MemberRole } from "@prisma/client";
import qs from "query-string";
import axios from "axios";
import { useRouter } from "next/navigation";
const MembersModal = () => {
  const router = useRouter();
  const { data, type, isOpen, onClose, onOpen } = useModal();

  const { server } = data as { server: Server_Members_Profiles_channels };
  const isModalOpen = isOpen && type === "manage-members";

  const [loadingId, setLoadingId] = useState("");

  const onRoleChange = async (memberId: string, selectedRole: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: { serverId: server.id },
      });
      await axios.patch(url, { role: selectedRole }).then((res) => {
        console.log(res.data.message);
        router.refresh();
        onOpen({ type: "manage-members", data: { server: res.data.server } });
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };
  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: { serverId: server.id },
      });
      await axios.delete(url).then((res) => {
        console.log(res.data.message);
        router.refresh();
        onOpen({ type: "manage-members", data: { server: res.data.server } });
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };
  return (
    <Dialog onOpenChange={() => onClose()} open={isModalOpen}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold capitalize">
            manage members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 capitalize">
            {server?.members?.length} members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member, i) => (
            <MemberItem
              displayActions={
                server.profileId !== member.profileId && loadingId !== member.id
              }
              key={member.id}
              member={member}
              index={i}
              isLoading={loadingId === member.id}
              onRoleChange={onRoleChange}
              onKick={onKick}
            />
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal;
