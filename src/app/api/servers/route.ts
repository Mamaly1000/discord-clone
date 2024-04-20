import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/prisma";

import { v4 as uuidv4 } from "uuid";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request) {
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
    const newServer = await db.server.create({
      data: {
        name: body.name,
        imageUrl: body.imageUrl,
        profileId: profile.id,
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    });
    return NextResponse.json({
      message: "server created",
      serverId: newServer.id,
    });
  } catch (error) {
    console.log(`[ERROR-POST-SERVERS]`, error);
    return new Response("Internall error", { status: 500 });
  }
}
