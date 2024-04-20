import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/prisma";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    const body: {
      name: string;
      imageUrl: string;
    } = await req.json();
    if (!profile) {
      return new NextResponse("unAuthenticated!", { status: 401 });
    }
    const existingServer = await db.server.findFirst({
      where: { name: body.name },
    });
    if (existingServer) {
      return new NextResponse("server already exists!", { status: 409 });
    }
    const updatedServer = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        name: body.name,
        imageUrl: body.imageUrl,
      },
    });
    return NextResponse.json({
      message: "server updated",
      serverId: updatedServer.id,
    });
  } catch (error) {
    console.log(`[ERROR-PATCH-SERVER]`, error);
    return new Response("Internall error", { status: 500 });
  }
}
