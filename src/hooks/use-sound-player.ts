import { create } from "zustand";
import { Howl } from "howler";

interface useSoundPlayerStore {
  sound: Howl;
  onPlay: (sound: Howl) => void;
  onLoad: (sound: Howl) => void;
}
export const useSoundPlayer = create<useSoundPlayerStore>((set) => ({
  sound: new Howl({
    src: "https://utfs.io/f/4d4add16-e3f5-4c53-a130-ee793745788f-khk817.mp3",
    preload: true,
    volume: 1,
  }),
  onPlay: (sound: Howl) => {
    sound.play();
  },
  onLoad: (sound: Howl) => {
    sound.load();
  },
}));
