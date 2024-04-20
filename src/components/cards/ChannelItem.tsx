"use client";
import { Channel } from "@prisma/client";
import React, { FC } from "react";

interface props {
  channel: Channel;
  index: number;
  className?: string;
  isLoading?: boolean;
}

const ChannelItem: FC<props> = ({ channel, index, className, isLoading }) => {
  return <div>{channel.name}</div>;
};

export default ChannelItem;
