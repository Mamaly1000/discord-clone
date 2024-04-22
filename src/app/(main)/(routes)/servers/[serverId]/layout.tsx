import ServerSidebar from "@/containers/server-sidebar/ServerSidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
  params,
}: {
  params: { serverId: string };
  children: React.ReactNode;
}) {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }
  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: { some: { profileId: profile.id } },
    },
  });
  if (!server) {
    return redirect("/");
  }

  return (
    <section className="h-full min-w-full">
      <section className="hidden md:flex h-full w-60 z-60 flex-col fixed inset-y-0">
        <ServerSidebar serverId={params.serverId} />
      </section>
      <main className="md:pl-60 h-full ">{children}</main>
    </section>
  );
}
