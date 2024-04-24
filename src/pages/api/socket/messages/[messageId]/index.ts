import serverAuth from "@/lib/current-profile-pages";
import { db } from "@/lib/prisma";
import { NextApiResponseServerIo } from "@/types";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "method not allowed!" });
  }

  try {
    const profile = await serverAuth(req);
    const {
      serverId,
      channelId,
      messageId,
    }: { serverId?: string; channelId?: string; messageId?: string } =
      req.query;
    const { content }: { content?: string } = req.body;

    if (!profile) {
      return res.status(400).json({ message: "Unathorized !" });
    }
    if (!channelId) {
      return res.status(400).json({ message: "Channel Id missing !" });
    }
    if (!messageId) {
      return res.status(400).json({ message: "Message Id missing !" });
    }
    if (!serverId) {
      return res.status(400).json({ message: "Server Id missing !" });
    }

    const server = await db.server.findFirst({
      where: { id: serverId, members: { some: { profileId: profile.id } } },
      include: { members: true },
    });
    if (!server) {
      return res.status(404).json({ message: "server not found!" });
    }

    const channel = await db.channel.findFirst({
      where: { id: channelId, serverId: server.id },
    });
    if (!channel) {
      return res.status(404).json({ message: "channel not found!" });
    }

    const member = server.members.find((m) => m.profileId === profile.id);
    if (!member) {
      return res.status(404).json({ message: "member not found!" });
    }

    let message = await db.message.findFirst({
      where: { id: messageId, channelId: channel.id },
      include: { member: { include: { profile: true } } },
    });
    if (!message || message.deleted) {
      return res.status(404).json({ message: "message not found!" });
    }

    const isOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ message: "Unathorized!" });
    }

    if (req.method === "DELETE") {
      message = await db.message.update({
        where: { id: messageId },
        data: { content, fileUrl: null, deleted: true },
        include: { member: { include: { profile: true } } },
      });
    }
    if (req.method === "PATCH") {
      if (!isOwner) {
        return res.status(401).json({ message: "Unathorized!" });
      }
      if (!content) {
        return res.status(400).json({ message: "Content missing !" });
      }
      message = await db.message.update({
        where: { id: messageId },
        data: { content },
        include: { member: { include: { profile: true } } },
      });
    }
    const updateKey = `chat:${channel.id}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json({ message });
  } catch (error) {
    console.log(`[ERROR-${req.method}-MESSAGE-ID-SOCKET]`, error);
    return res.status(500).json({ message: "Internall Error!" });
  }
}
