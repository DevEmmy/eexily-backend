import { Service } from "typedi";
import "reflect-metadata";
import { UserServices } from "../services/UserServices";
import { Request, Response } from "express";
import { UserLoginDto, createUserDto, userDto } from "../interfaces/user";
import { error, success } from "../utils/response";

@Service()
export class UserController{
    constructor(
        private readonly service : UserServices,
    ){}

    async signUp(req: Request, res: Response){
        try{
            const body : createUserDto = req.body;
            let {payload, message} = await this.service.signUp(body);
            console.log(body)
            console.log(payload)
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

    async verifyOtp(req: Request, res: Response){
        try{
            const {otp, email} = req.body;
            
            let {payload, message} = await this.service.verifyOtp(otp, email);
            
            if(!payload && message){
                return error(message, res, 400)
            }
            return success(payload, res);
        }   
        catch(err: any){
            error(err.message, res, err.status||400);
        }
    }

    async forgotPassword(req: Request, res: Response){
        try{
            const {email} = req.body;
            
            let { message} = await this.service.forgotPassword(email);
            
            return res.json({message})
        }   
        catch(err: any){
            error(err.message, res, err.status||400);
        }
    }

    async updatePassword(req: Request, res: Response){
        try{
            const {otp, newPassword} = req.body;
            
            let {message} = await this.service.updatePassword(otp, newPassword);
            
            return res.json({message})
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

    async completeRegistration(req: Request, res: Response){
        try{
            const body  = req.body;
            const {type, email, _id} = req.body.user;
            let {payload, message} = await this.service.completeProfile(_id, body)
            
            if(!payload && message){
                return error(message, res, 400)
            }
            return success(payload, res, message);
        }   
        catch(err: any){
            error(err.message, res, err.status||400);
        }
    }
    
}