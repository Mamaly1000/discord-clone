import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";
import NavigationAction from "./NavigationAction";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationItem from "./NavigationItem";
import { ModeToggle } from "@/components/common/toggle-theme";
import { UserButton } from "@clerk/nextjs";
import NotifBell from "@/components/ui/NotifBell";

const NavigationSidebar = async () => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }
  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <section className="flex-col gap-4 flex items-center h-full text-primary w-full bg-[#e3e5e8] dark:bg-[#1e1f22] py-4 ">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex flex-col items-start justify-start w-full gap-5">
        {servers.map((server, i) => (
          <NavigationItem
            className="mb-2"
            key={server.id}
            server={server}
            index={i}
          />
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex flex-col items-center gap-y-4">
        <NotifBell />
        <ModeToggle />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]",
            },
          }}
          afterSignOutUrl="/"
        />
      </div>
    </section>
  );
};

export default NavigationSidebar;
