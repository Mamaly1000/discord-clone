"use client";
import { useSoundPlayer } from "@/hooks/use-sound-player";
import { ReactNode, useEffect } from "react";

const SoundProvider = ({ children }: { children: ReactNode }) => {
  const { onLoad, sound } = useSoundPlayer();
  useEffect(() => {
    onLoad(sound);
  }, []);

  return children;
};

export default SoundProvider;
