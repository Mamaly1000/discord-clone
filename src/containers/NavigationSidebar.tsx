import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";

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
    <section className="space-y-4 flex-col flex items-center h-full text-primary w-full dark:bg-[#1e1f22]">
       
    </section>
  );
};

export default NavigationSidebar;
