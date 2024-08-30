import { Schema, Types } from "mongoose";

export interface BusinessInterface{
    user: Types.ObjectId | string,
    address: string,
    category: string
}