import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

const UserAvatar = ({
  src,
  className,
}: {
  className?: string;
  src?: string;
}) => {
  return (
    <Avatar className={cn("h-7 w-7 md:h-10 md:w-10 bg-neutral-400 dark:bg-zinc-500", className)}>
      <AvatarImage src={src} />
    </Avatar>
  );
};

export default UserAvatar;
