import { Server, Socket } from "socket.io";

let io: Server;

interface ActiveUsers{
    userId: string,
    socketId: string
  };

  const activeUsers : ActiveUsers[] = [

  ]

export const configureSocket = (httpServer: any): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // Adjust based on your client
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("init", (userId)=>{
        activeUsers.push({userId, socketId: socket.id});
        console.log(activeUsers);
    })

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Helper function to emit events
export const emitSocketEvent = (event: string, data: any, userId: string) => {
  if (io) {
    let socketId = (activeUsers.find(item => item.userId == userId))?.socketId
    if(socketId){
        io.to(socketId).emit(event, data);
    }
    else{
        console.log("socketId not found")
    }
  }
};
