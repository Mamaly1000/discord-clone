"use client";
import ChannelsModal from "@/components/modals/ChannelsModal";
import InviteModal from "@/components/modals/InviteModal";
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
    </>
  );
};

export default ModalProvider;
