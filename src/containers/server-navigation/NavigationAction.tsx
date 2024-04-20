"use client";
import CustomTooltip from "@/components/common/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { Plus } from "lucide-react";
import React from "react";

const NavigationAction = () => {
  const { onOpen } = useModal();
  return (
    <CustomTooltip align="center" side="right" label="create new server">
      <button
        onClick={() => onOpen({ type: "create-server" })}
        className="group flex items-center "
      >
        <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500 ">
          <Plus
            className="group-hover:text-white transition text-emerald-500"
            size={40}
          />
        </div>
      </button>
    </CustomTooltip>
  );
};

export default NavigationAction;
