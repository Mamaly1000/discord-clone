"use client";
import ChannelsModal from "@/components/modals/ChannelsModal";
import DeleteServerModal from "@/components/modals/DeleteServerModal";
import InviteModal from "@/components/modals/InviteModal";
import LeaveServerModal from "@/components/modals/LeaveServerModal";
import MembersModal from "@/components/modals/MembersModal";
import ServerModal from "@/components/modals/ServerModal";
import ServerSettingModal from "@/components/modals/ServerSettingModal";
import React, { useEffect, useState } from "react";

const ModalProvider = () => {
  const [isMounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <>
      <ServerModal />
      <ServerSettingModal />
      <InviteModal />
      <MembersModal />
      <ChannelsModal />
      <LeaveServerModal />
      <DeleteServerModal />
    </>
  );
};

export default ModalProvider;
