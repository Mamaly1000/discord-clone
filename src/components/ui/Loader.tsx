import { Loader2 } from "lucide-react";
import React from "react";

const Loader = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col w-full flex-1 justify-center items-center">
      <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{message}</p>
    </div>
  );
};

export default Loader;
