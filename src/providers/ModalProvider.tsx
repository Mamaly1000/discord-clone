"use client";
import InviteModal from "@/components/modals/InviteModal";
import ServerModal from "@/components/modals/ServerModal";
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
      <InviteModal />
    </>
  );
};

export default ModalProvider;
