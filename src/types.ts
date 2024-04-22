import { Channel, Conversation, Member, Profile, Server } from "@prisma/client";

export type Server_Members_Profiles_channels = Server & {
  members: Array<Member & { profile: Profile }>;
  channels: Channel[];
};
export type SafeConversationType = Conversation & {
  memberTwo: Member & { profile: Profile };
  memberOne: Member & { profile: Profile };
};
