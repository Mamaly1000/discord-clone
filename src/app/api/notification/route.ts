import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/prisma";
import { Channel, Message, Prisma, Notification } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");
    const serverId = searchParams.get("serverId");
    const limit = searchParams.get("limit");
    const NOTIFICATIONS_BATCH = !!limit ? +limit : undefined;

    if (!profile) {
      return new NextResponse("Unathorized !", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("serverId not found !", { status: 404 });
    }
    let notifications: (Notification & {
      message: Message;
      channel: Channel;
    })[] = [];
    let where: Prisma.NotificationWhereInput | undefined = {
      profileId: profile.id,
      serverId,
    };
    let include = {
      message: { include: { member: { include: { profile: true } } } },
      channel: true,
    };

    if (channelId) {
      where.channelId = channelId;
    }

    if (!!cursor && !!NOTIFICATIONS_BATCH) {
      notifications = await db.notification.findMany({
        where,
        cursor: { id: cursor },
        take: NOTIFICATIONS_BATCH,
        skip: 1,
        orderBy: { createdAt: "desc" },
        include,
      });
    } else {
      notifications = await db.notification.findMany({
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
    console.log(`[ERROR-GET-NOTIFICATIONS]`, error);
    return new NextResponse("Internall Error", { status: 500 });
  }
}
