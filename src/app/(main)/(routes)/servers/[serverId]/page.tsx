import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/prisma";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const ServerPage = async ({ params }: { params: { serverId: string } }) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: { some: { profileId: profile.id } },
    },
    include: {
      channels: {
        where: { name: "general" },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
  if (!server) {
    return redirect("/");
  }
  const init = server.channels[0];
  if (init.name !== "general") {
    return null;
  }

  return redirect(`/servers/${params.serverId}/channels/${init.id}`);
};

export default ServerPage;
