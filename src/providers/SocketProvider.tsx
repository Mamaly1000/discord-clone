"use client";
import React, { ReactNode } from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO } from "socket.io-client";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  socket: null,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setConnected] = useState(false);

  useEffect(() => {
    const socketInstance = new (ClientIO as any)(
      process.env.NEXT_PUBLIC_SITE_URL!,
      {
        path: "/api/socket/io",
        addTrailingSlash: false,
      }
    );
    socketInstance.on("connect", () => setConnected(true));
    socketInstance.on("disconnect", () => setConnected(false));

    setSocket(socketInstance);
    return () => socketInstance.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{ isConnected, socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
