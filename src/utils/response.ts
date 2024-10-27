import { Response } from "express";

export const success = (payload: any, res: Response, message? : string )=>{
    return res.status(200).json({
        message: message ||  "Success",
        payload
    })
}

export const error = (message: string, res: Response, status: number | null )=>{
    return res.status(status ||400 ).json({
        message: message,
    })
}