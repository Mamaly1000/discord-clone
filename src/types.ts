import { Channel, Member, Profile, Server } from "@prisma/client";

export type Server_Members_Profiles_channels = Server & {
  members: Array<Member & { profile: Profile }>;
  channels: Channel[];
};
