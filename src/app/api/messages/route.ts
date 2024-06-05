import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/prisma";
import { Message, Profile } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGE_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unathorized !", { status: 401 });
    }
    if (!channelId) {
      return new NextResponse("Channel Id missing !", { status: 400 });
    }

    let messages: Array<Message & { member: { profile: Profile } }> = [];

    if (cursor) {
      messages = await db.message.findMany({
        include: { member: { include: { profile: true } } },
        cursor: { id: cursor },
        where: { channelId },
        take: MESSAGE_BATCH,
        skip: 1,
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGE_BATCH,
        where: { channelId },
        include: { member: { include: { profile: true } } },
        orderBy: { createdAt: "desc" },
      });
    }

    let nextCursor = null;
    if (messages.length === MESSAGE_BATCH) {
      nextCursor = messages[MESSAGE_BATCH - 1].id;
    }

    // handle notifications
    if (serverId) {
      try {
        // delete seen notifications
        const seenNotfications = await db.notification.findMany({
          where: {
            profileId: profile.id,
            messageId: {
              in: messages.map((m) => m.id),
            },
            isSeen: true,
            serverId,
          },
        });
        if (seenNotfications.length > 0) {
          await db.notification.deleteMany({
            where: {
              id: { in: seenNotfications.map((n) => n.id) },
            },
          });
        }
        // set unseen notificatoins to seen
        await db.notification.updateMany({
          where: {
            profileId: profile.id,
            messageId: { in: messages.map((m) => m.id) },
            isSeen: false,
          },
          data: {
            isSeen: true,
          },
        });
      } catch (error) {
        console.log(`[ERROR-UPDATE-DELETE-NOTIFICATIONS]`, error);
      }
    }

    return NextResponse.json({ items: messages, nextCursor });
  } catch (error) {
    console.log(`[ERROR-GET-MESSAGES]`, error);
    return new NextResponse("Internall Error", { status: 500 });
  }
}
