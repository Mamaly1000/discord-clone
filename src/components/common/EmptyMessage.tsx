"use client";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const EmptyMessage = ({
  action,
  Icon,
  message,
  className,
}: {
  className?: string;
  Icon: LucideIcon;
  message: string;
  action?: { label: string; onClick: () => void };
}) => {
  return (
    <section
      className={cn(
        "w-full flex items-center justify-center flex-col gap-3  text-neutral-500 dark:text-neutral-100",
        className
      )}
    >
      <Icon className="w-14 h-14" />
      <p className="text-sm">{message}</p>
      {action && (
        <Button onClick={action.onClick} variant={"outline"}>
          {action.label}
        </Button>
      )}
    </section>
  );
};

export default EmptyMessage;
