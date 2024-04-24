"use client";

import { useEffect, useState } from "react";

import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";

import { useUser } from "@clerk/nextjs";
import Loader from "./ui/Loader";

interface MediaRoomProps {
  chatId: string;
  video?: boolean;
  audio?: boolean;
}

const MediaRoom = ({ chatId, audio, video }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;
    const name = `${user.firstName} ${user.lastName}`;
    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [user?.firstName, user?.lastName, chatId]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center w-full">
        <Loader message="loading...." />
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      audio={audio}
      video={video}
      className="min-h-screen max-w-full overflow-hidden [&>.lk-control-bar]:flex [&>.lk-control-bar]:flex-wrap [&>.lk-control-bar]:max-w-full "
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
export default MediaRoom;
