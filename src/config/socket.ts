// src/config/socket.ts

import { Server } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

// This map will hold userId as key and socketId as value
const connectedUsers: Map<string, string> = new Map();

let io: SocketIOServer | null = null;

// Initialize Socket.IO
const initSocket = (server: Server): void => {
  io = new SocketIOServer(server);
  console.log("Socket.IO server initialized");

  io.on("connection", (socket: Socket) => {
    console.log("New client connected:", socket.id);

    // Listen for user identification event
    socket.on("init", (userId: string) => {
      console.log(`User identified: ${userId}`);
      connectedUsers.set(userId, socket.id);

      // Notify other clients of the user's online status
      io?.emit("userOnline", userId);
    });

    // Handle client disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);

      // Find userId based on socketId and remove from the map
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          // Notify others of the user's offline status
          io?.emit("userOffline", userId);
          break;
        }
      }
    });
  });
};

export const emitSocketEvent = (event: string, data: any, userId: string): void => {
  if (io) {
    const socketId = connectedUsers.get(userId); // Get the socketId from the map
    if (socketId) {
      io.to(socketId).emit(event, data); // Emit event to the specific socketId
    } else {
      console.log("socketId not found for userId:", userId);
    }
  } else {
    console.log("Socket.IO is not initialized");
  }
};

// Get the initialized Socket.IO instance
const getIo = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};

export { initSocket, getIo, connectedUsers };
