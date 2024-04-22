import { db } from "@/lib/prisma";
import { SafeConversationType } from "@/types";

export const GET_OR_CREATE_CONVERSATION = async (
  memberOneId: string,
  memberTwoId: string
): Promise<null | SafeConversationType> => {
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId));
  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId);
  }
  return conversation;
};

const findConversation = async (
  memberOneId: string,
  memberTwoId: string
): Promise<null | SafeConversationType> => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [
          { memberOne: { id: memberOneId } },
          { memberTwo: { id: memberTwoId } },
        ],
      },
      include: {
        memberOne: { include: { profile: true } },
        memberTwo: { include: { profile: true } },
      },
    });
  } catch {
    return null;
  }
};
const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
): Promise<null | SafeConversationType> => {
  try {
    return await db.conversation.create({
      data: { memberOneId, memberTwoId },
      include: {
        memberOne: { include: { profile: true } },
        memberTwo: { include: { profile: true } },
      },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};
