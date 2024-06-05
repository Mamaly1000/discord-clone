import serverAuth from "@/lib/current-profile-pages";
import { db } from "@/lib/prisma";
import { NextApiResponseServerIo } from "@/types";
import { NotificationType } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed!" });
  }
  try {
    const profile = await serverAuth(req);
    const { content, fileUrl }: { content?: string; fileUrl?: string } =
      req.body;
    const { serverId, channelId }: { serverId?: string; channelId?: string } =
      req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!serverId) {
      return res.status(400).json({ error: "Server Id missing!" });
    }
    if (!channelId) {
      return res.status(400).json({ error: "ChannelId Id missing!" });
    }
    if (!content) {
      return res.status(400).json({ error: "Content Id missing!" });
    }
    // finding the server
    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: { some: { profileId: profile.id } },
      },
      include: { members: true },
    });
    if (!server) {
      return res.status(404).json({ message: "Server not found!" });
    }
    // finding the channel
    const channel = await db.channel.findFirst({
      where: { id: channelId, serverId },
    });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found!" });
    }
    // finding the member
    const member = server.members.find((m) => m.profileId === profile.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found!" });
    }
    // create the message
    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    try {
      // create notification
      const profiles = await db.profile.findMany({
        where: {
          id: {
            not: message.member.profile.id,
            in: server.members.map((m) => m.profileId),
          },
        },
      });

      await db.notification.createMany({
        data: profiles.map((p) => ({
          channelId: channel.id,
          messageId: message.id,
          profileId: p.id,
          type: NotificationType.CHANNEL_NOTIF,
          serverId: server.id,
        })),
      });
    } catch (error) {
      console.log(`[NOTIFICATION-CREATE-MESSAGE-ERROR]`, error);
    }
    // create a key for our socket and pass the message to it
    const channelKey = `chat:${channel.id}:messages`;
    // add a message to the socket
    res?.socket?.server?.io?.emit(channelKey, message);
    // send response with status 200
    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGES-ERROR-POST-SOCKET]", error);
    return res.status(500).json({ message: "Internall Error" });
  }
}
