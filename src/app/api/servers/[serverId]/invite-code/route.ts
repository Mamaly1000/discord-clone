import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
  _req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("unAuthorized!", { status: 401 });
    }
    if (!params.serverId) {
      return new NextResponse("Server ID is missing!", { status: 400 });
    }
    const server = await db.server.update({
      where: { profileId: profile.id, id: params.serverId },
      data: { inviteCode: uuidv4() },
    });
    return NextResponse.json({
      server,
      message: "server invitation code reGenerated!",
    });
  } catch (error) {
    console.log("[SERVER-INVITE-CODE]", error);
    return new NextResponse("Internall error!", { status: 500 });
  }
}
