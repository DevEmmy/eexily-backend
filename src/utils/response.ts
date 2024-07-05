import { Response } from "express";

export const success = (payload: any, res: Response)=>{
    return res.status(200).json({
        message: "Success",
        payload
    })
}

export const error = (message: string, res: Response, status: number | null )=>{
    return res.status(400 || status).json({
        message: message,
    })
}