"use client";
import React, { ReactNode } from "react";
import { Sheet } from "../ui/sheet";
import { useServerNavigation } from "@/hooks/use-server-navigation";

const MobileNavSheet = ({ children }: { children: ReactNode }) => {
  const { open, onChange } = useServerNavigation();
  return (
    <Sheet open={open} defaultOpen={false} onOpenChange={onChange}>
      {children}
    </Sheet>
  );
};

export default MobileNavSheet;
