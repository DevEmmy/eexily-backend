import { Service } from "typedi";
import { emitSocketEvent } from "../config/socket";
import { INotification } from "../models/notification";

@Service()
class SocketServices{
    constructor(){
    }

    sendSocketNotification(userId: string, notifcation: Partial<INotification>){
        emitSocketEvent("notification", notifcation, userId);
    }
}

export default SocketServices