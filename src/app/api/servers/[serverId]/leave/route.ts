import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
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
      where: {
        id: params.serverId,
        profileId: { not: profile.id },
        members: {
          some: { profileId: profile.id },
        },
      },
      data: {
        members: {
          deleteMany: { profileId: profile.id },
        },
      },
    });
    return NextResponse.json({
      message: `you leaved ${server.name} server!`,
    });
  } catch (error) {
    console.log(`[ERROR-PATCH-LEAVE-SERVER]`, error);
    return new NextResponse("Internall error", { status: 500 });
  }
}
