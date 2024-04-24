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
      conversationId,
      messageId,
    }: { conversationId?: string; messageId?: string } = req.query;
    const { content }: { content?: string } = req.body;

    if (!profile) {
      return res.status(400).json({ message: "Unathorized !" });
    }
    if (!conversationId) {
      return res.status(400).json({ message: "Conversation Id missing !" });
    }
    if (!messageId) {
      return res.status(400).json({ message: "Message Id missing !" });
    }
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { memberOne: { profileId: profile.id } },
          { memberTwo: { profileId: profile.id } },
        ],
      },
      include: {
        memberOne: { include: { profile: true } },
        memberTwo: { include: { profile: true } },
      },
    });
    if (!conversation) {
      return res.status(404).json({ message: "conversation not found!" });
    }

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;
    if (!member) {
      return res.status(404).json({ message: "member not found!" });
    }

    let directMessage = await db.directMessage.findFirst({
      where: { id: messageId, conversationId: conversation.id },
      include: { member: { include: { profile: true } } },
    });
    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ message: "message not found!" });
    }

    const isOwner = directMessage.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ message: "Unathorized!" });
    }

    if (req.method === "DELETE") {
      directMessage = await db.directMessage.update({
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
      directMessage = await db.directMessage.update({
        where: { id: messageId },
        data: { content },
        include: { member: { include: { profile: true } } },
      });
    }
    const updateKey = `chat:${conversation.id}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, directMessage);

    return res.status(200).json({ directMessage });
  } catch (error) {
    console.log(`[ERROR-${req.method}-DIRECT-MESSAGE-ID-SOCKET]`, error);
    return res.status(500).json({ message: "Internall Error!" });
  }
}
