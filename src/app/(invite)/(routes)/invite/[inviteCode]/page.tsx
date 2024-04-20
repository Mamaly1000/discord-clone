import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/prisma";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const InviteCodePage = async ({
  params,
}: {
  params: { inviteCode: string };
}) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  if (!params.inviteCode) {
    return redirect("/");
  }
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: { some: { profileId: profile.id } },
    },
  });
  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }
  const server = await db.server.update({
    where: { inviteCode: params.inviteCode },
    data: { members: { create: [{ profileId: profile.id }] } },
  });
  if (server) {
    return redirect(`/servers/${server.id}`);
  }
  return (
    <div className="w-full h-full flex items-center justify-center bg-transparent text-2xl capitalize">
      please wait to join the server through invitation code
    </div>
  );
};

export default InviteCodePage;
