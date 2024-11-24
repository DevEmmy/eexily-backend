import { Service } from "typedi";
import { emitSocketEvent, getIo } from "../config/socket";
import { INotification } from "../models/notification";
import { Server as SocketIOServer } from "socket.io";

@Service()
class SocketServices {
  private io: SocketIOServer | null;

  constructor() {
    this.io = null;
  }

  // Initialize the Socket.IO instance
  initialize(): void {
    try {
      this.io = getIo();
      console.log("Socket.IO instance initialized");
    } catch (error: any) {
      console.error("Error initializing SocketServices:", error.message);
    }
  }

  sendSocketNotification(userId: string, notifcation: Partial<INotification>){
    emitSocketEvent("notification", notifcation, userId);
}
}


export default SocketServices