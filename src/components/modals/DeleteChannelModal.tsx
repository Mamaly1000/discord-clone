"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";
import { Button } from "../ui/button";
import { useParams, useRouter } from "next/navigation";
import qs from "query-string";

const DeleteChannelModal = () => {
  const router = useRouter();
  const params = useParams();

  const { data, type, isOpen, onClose } = useModal();
  const { channel, server } = data;
  const isModalOpen = isOpen && type === "delete-channel";

  const [isLoading, setLoading] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: { serverId: server?.id },
      });
      await axios.delete(url).then((res) => {
        console.log(res.data.message);
        onClose();
        router.refresh();
        router.push(
          !!!params?.channelId
            ? `/servers/${params?.serverId}`
            : params?.channelId === channel?.id
            ? `/servers/${params?.serverId}`
            : `/${params?.serverId}/channels/${params?.channelId}`
        );
        router.refresh();
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const onCancel = () => {
    onClose();
  };
  return (
    <Dialog onOpenChange={() => !isLoading && onClose()} open={isModalOpen}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6 capitalize">
          <DialogTitle className="text-2xl text-center font-bold capitalize">
            delete channel
          </DialogTitle>
          <DialogDescription className="font-normal text-center text-zinc-500">
            are you sure you want to do this? <br />
            <span className="font-semibold text-indigo-500 capitalize">
              {channel?.name}
            </span>{" "}
            will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="w-full grid  grid-cols-1 sm:grid-cols-2 gap-2">
            <Button disabled={isLoading} onClick={onCancel} variant={"ghost"}>
              cancel
            </Button>
            <Button disabled={isLoading} onClick={onDelete} variant={"primary"}>
              confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelModal;
