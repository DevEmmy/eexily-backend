import { Service } from "typedi";
import NotificationService from "../services/NotificationServices";
import { Request, Response } from "express";
import { error, success } from "../utils/response";

@Service()
class NotificationController{
    constructor(private readonly service : NotificationService){}

    async getUsersNotification(req: Request, res: Response){
        try{
            const user = req.body.user;
            let payload= await this.service.getUserNotifications(user)
            
            if(!payload){
                return error("An Error Occured", res, 400)
            }
            return success(payload, res);
        }   
        catch(err: any){
            error(err.message, res, err.status||400);
        }
    }
    
}

export default NotificationController