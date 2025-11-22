
import { Server } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";

interface SocketServer extends HTTPServer {
  io?: Server;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (res.socket.server.io) {
    console.log("Socket is already running.");
  } else {
    console.log("Socket is initializing...");
    const io = new Server(res.socket.server, {
      path: "/api/socket_io",
      addTrailingSlash: false,
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log(`A user connected: ${socket.id}`);

      socket.on("join-room", (roomId: string) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
      });

      socket.on("send-message", (data: { roomId: string; message: string }) => {
        // Broadcast to everyone in the room except the sender
        socket.broadcast.to(data.roomId).emit("new-message", data.message);
      });

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }
  res.end();
}
