import { NextFunction, Request, Response } from "express";
require("dotenv").config()
import jwt from "jsonwebtoken"

let jwtSecret = process.env.JWT_SECRET as string;

export const verifyAuth = (request: Request, response: Response, next: NextFunction)=>{
    try{
        const authorization = request.headers.authorization as string;
        let token = authorization.replace("Bearer ", "");
        if(token){
            let payload: any = jwt.verify(token, jwtSecret)

            if(!payload){
                return response.status(400).json({message: "User not Authorized"});
            }
            request.body.user = payload.id;
            next()
            return null;
        }
        else{
            return response.status(400).json({message: "User not Authorized"});
        }
    }
    catch(err: any){
        return response.status(400).json({message: err.message});
    }
}