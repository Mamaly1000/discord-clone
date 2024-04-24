import serverAuth from "@/lib/current-profile-pages";
import { db } from "@/lib/prisma";
import { NextApiResponseServerIo } from "@/types";
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
    const { conversationId }: { conversationId?: string } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!conversationId) {
      return res.status(400).json({ error: "conversationId Id missing!" });
    }
    if (!content) {
      return res.status(400).json({ error: "Content Id missing!" });
    }
    // finding the channel
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
      return res.status(404).json({ message: "Conversation not found!" });
    }
    // finding the member
    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;
    if (!member) {
      return res.status(404).json({ message: "Member not found!" });
    }
    // create the message
    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId,
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
    // create a key for our socket and pass the message to it
    const conversatoinKey = `chat:${conversation.id}:messages`;
    res?.socket?.server?.io?.emit(conversatoinKey, message);
    // send response with status 200
    return res.status(200).json(message);
  } catch (error) {
    console.log("[DIRECT-MESSAGES-ERROR-POST-SOCKET]", error);
    return res.status(500).json({ message: "Internall Error" });
  }
}
