import { Service } from "typedi";
import "reflect-metadata";
import { UserServices } from "../services/UserServices";
import { Request, Response } from "express";
import { UserLoginDto, userDto } from "../dto/user-dto";
import { error, success } from "../utils/response";

@Service()
export class UserController{
    constructor(
        private readonly service : UserServices,
    ){}

    async signUp(req: Request, res: Response){
        try{
            const body : userDto = req.body;
            let {payload, message} = await this.service.signUp(body);
            if(!payload && message){
                return error(message, res, 400)
            }
            return success(payload, res);
        }   
        catch(err: any){
            error(err.message, res, err.status||400);
        }
    }

    async signIn(req: Request, res: Response){
        try{
            const body : UserLoginDto = req.body;
            console.log(body)
            let {payload, message} = await this.service.signIn(body);
            
            if(!payload && message){
                return error(message, res, 400)
            }
            return success(payload, res);
        }   
        catch(err: any){
            error(err.message, res, err.status||400);
        }
    }

   
    async getLoggedInUser(req: Request, res: Response){
        try{
            const {user} = req.body;
            
            // return success(payload, res);
        }   
        catch(err: any){
            error(err.message, res, err.status||400);
        }
    }
}