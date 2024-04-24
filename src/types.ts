import {
  Channel,
  Conversation,
  Member,
  Message,
  Profile,
  Server,
} from "@prisma/client";
import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export type Server_Members_Profiles_channels = Server & {
  members: Array<Member & { profile: Profile }>;
  channels: Channel[];
};
export type SafeConversationType = Conversation & {
  memberTwo: Member & { profile: Profile };
  memberOne: Member & { profile: Profile };
};
export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
export type safeMessageType = Message & {
  member: Member & { profile: Profile };
};
