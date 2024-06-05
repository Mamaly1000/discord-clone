import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/prisma";
import { safeDirectNotification } from "@/types";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");
    const serverId = searchParams.get("serverId");
    const limit = searchParams.get("limit");
    const NOTIFICATIONS_BATCH = !!limit ? +limit : undefined;

    if (!profile) {
      return new NextResponse("Unathorized !", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("serverId not found !", { status: 404 });
    }
    let notifications: safeDirectNotification[] = [];
    let where: Prisma.DirectNotificationWhereInput | undefined = {
      profileId: profile.id,
      serverId,
    };
    let include = {
      directMessage: { include: { member: { include: { profile: true } } } },
      conversation: true,
    };

    if (conversationId) {
      where.conversationId = conversationId;
    }

    if (!!cursor && !!NOTIFICATIONS_BATCH) {
      notifications = await db.directNotification.findMany({
        where,
        cursor: { id: cursor },
        take: NOTIFICATIONS_BATCH,
        skip: 1,
        orderBy: { createdAt: "desc" },
        include,
      });
    } else {
      notifications = await db.directNotification.findMany({
        where,
        include,
        orderBy: { createdAt: "desc" },
      });
    }

    let nextCursor = null;
    if (notifications.length === NOTIFICATIONS_BATCH) {
      nextCursor = notifications[NOTIFICATIONS_BATCH - 1].id;
    }

    return NextResponse.json({ items: notifications, nextCursor });
  } catch (error) {
    console.log(`[ERROR-GET-DIRECT-NOTIFICATIONS]`, error);
    return new NextResponse("Internall Error", { status: 500 });
  }
}
