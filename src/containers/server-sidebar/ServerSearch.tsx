"use client";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command, Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { FC, ReactNode, useEffect, useState } from "react";

interface props {
  data?: {
    label: string;
    type: "channel" | "member";
    data: { icon: ReactNode; name: string; id: string }[] | undefined;
  }[];
}

const ServerSearch: FC<props> = ({ data = [] }) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const params = useParams();

  const onClick = ({
    type,
    id,
  }: {
    id: string;
    type: "channel" | "member";
  }) => {
    setOpen(false);
    if (type === "member") {
      return router.push(`/servers/${params?.serverId}/conversations/${id}`);
    }
    if (type === "channel") {
      return router.push(`/servers/${params?.serverId}/channels/${id}`);
    }
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
      >
        <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
          search
        </p>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded-none border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
          <span className="text-xs">
            <Command className="w-2 h-2" />
          </span>
          K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={() => setOpen(false)}>
        <CommandInput placeholder="Search all channels and members" />
        <CommandList className="capitalize">
          {data.map(
            ({ data, label, type }) =>
              !!data?.length && (
                <CommandGroup key={label} heading={label}>
                  {data?.map(({ icon, id, name }) => (
                    <CommandItem onSelect={() => onClick({ id, type })} key={id}>
                      {icon} <span>{name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
          )}
          <CommandEmpty>no results found</CommandEmpty>
        </CommandList>
      </CommandDialog>
      ;
    </>
  );
};

export default ServerSearch;
