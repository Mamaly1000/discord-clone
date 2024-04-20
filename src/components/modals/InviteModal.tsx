"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import useOrigin from "@/hooks/use-origin";
import axios from "axios";

const InviteModal = () => {
  const { data, type, isOpen, onClose, onOpen } = useModal();

  const origin = useOrigin();
  const isModalOpen = isOpen && type === "invite-member";
  const inviteUrl = `${origin}/invite/${data?.server?.inviteCode}`;

  const [copied, setCopied] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  const onNewInviteLink = async () => {
    try {
      setLoading(true);
      await axios
        .patch(`/api/servers/${data.server?.id}/invite-code`)
        .then((res) => {
          console.log(res.data.message);
          console.log(res.data);

          onOpen({ type: "invite-member", data: { server: res.data.server } });
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={() => !isLoading && onClose()} open={isModalOpen}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold capitalize">
            invite your friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            server invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
              readOnly
            />
            <Button
              disabled={isLoading}
              variant={"primary"}
              onClick={onCopy}
              size={"icon"}
            >
              {!copied ? (
                <Copy className="w-4 h-4" />
              ) : (
                <Check className="w-4 h-4 text-green-500" />
              )}
            </Button>
          </div>
          <Button
            onClick={onNewInviteLink}
            className="text-xs text-zinc-500 mt-4"
            variant={"link"}
            size={"sm"}
            disabled={isLoading}
          >
            Generate a new link <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
