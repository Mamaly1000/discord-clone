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
import { useRouter } from "next/navigation";

const LeaveServerModal = () => {
  const router = useRouter();

  const { data, type, isOpen, onClose } = useModal();
  const { server } = data;
  const isModalOpen = isOpen && type === "leave-server";

  const [isLoading, setLoading] = useState(false);

  const onLeave = async () => {
    try {
      setLoading(true);
      await axios.patch(`/api/servers/${server?.id}/leave`).then((res) => {
        console.log(res.data.message);
        onClose();
        router.refresh();
        router.push("/");
        window.location.reload();
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
            leave server
          </DialogTitle>
          <DialogDescription className="font-normal text-center text-zinc-500">
            are you sure you want to leave{" "}
            <span className="font-semibold text-indigo-500 capitalize">
              {server?.name}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="w-full grid  grid-cols-1 sm:grid-cols-2 gap-2">
            <Button disabled={isLoading} onClick={onCancel} variant={"ghost"}>
              cancel
            </Button>
            <Button disabled={isLoading} onClick={onLeave} variant={"primary"}>
              confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveServerModal;
