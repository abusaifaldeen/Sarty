
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

// In-memory store for user ID to socket ID mapping
const userSocketMap: { [userId: string]: string } = {};

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

      socket.on('register', (userId: string) => {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} registered with socket ${socket.id}`);
      });

      socket.on("join-room", (roomId: string) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
      });

      socket.on("send-message", (data: { roomId: string; message: string, sender_id: string }) => {
        socket.broadcast.to(data.roomId).emit("new-message", data);
      });

      socket.on("send-private-message", (data: { toUserId: string, content: string, sender_id: string }) => {
        const recipientSocketId = userSocketMap[data.toUserId];
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('private-message', {
            content: data.content,
            sender_id: data.sender_id,
          });
        }
      });

      socket.on("disconnect", () => {
        // Find the user and remove them from the map
        for (const userId in userSocketMap) {
          if (userSocketMap[userId] === socket.id) {
            delete userSocketMap[userId];
            console.log(`User ${userId} unregistered`);
            break;
          }
        }
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }
  res.end();
}
