import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/prisma";
import { ChannelType, MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("unAuthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server Id missing!", { status: 400 });
    }
    if (!params.channelId) {
      return new NextResponse("Channel Id missing!", { status: 400 });
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
          },
        },
      },
      data: {
        channels: {
          delete: { id: params.channelId, name: { not: "general" } },
        },
      },
      include: {
        channels: {
          orderBy: {
            createdAt: "asc",
          },
        },
        members: {
          include: {
            profile: true,
          },
          orderBy: { role: "asc" },
        },
      },
    });
    return NextResponse.json({ message: "channel deleted!", server });
  } catch (error) {
    console.log(`[CHANNEL-ID-DELETE-ERROR]`, error);
    return new NextResponse("Internall error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
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
    if (!params.channelId) {
      return new NextResponse("Channel Id missing!", { status: 400 });
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
          update: {
            where: { id: params.channelId },
            data: { name, type },
          },
        },
      },
    });
    return NextResponse.json({ server, message: "Channel updated!" });
  } catch (error) {
    console.log(`[ERROR-PATCH-CHANNEL-ID]`, error);
    return new NextResponse("Internall Error!", { status: 500 });
  }
}
