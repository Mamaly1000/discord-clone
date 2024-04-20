import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/prisma";
import { ChannelType, MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { name, type = "TEXT" }: { name?: string; type?: ChannelType } =
      await req.json();
    const serverId = searchParams.get("serverId");
    if (!profile) {
      return new NextResponse("unAuthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server Id missing!", { status: 400 });
    }
    if (!name) {
      return new NextResponse("Name is missing!", { status: 400 });
    }
    if (name?.toLowerCase() === "general") {
      return new NextResponse("Name cannot be 'general'!", { status: 400 });
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            name,
            type,
            profileId: profile.id,
          },
        },
      },
    });
    return NextResponse.json({ server, message: "Channel created!" });
  } catch (error) {
    console.log(`[ERROR-POST-CHANNEL]`, error);
    return new NextResponse("Internall Error!", { status: 500 });
  }
}
