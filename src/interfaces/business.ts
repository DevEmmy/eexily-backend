import { Schema } from "mongoose";

export interface Business{
    user: Schema.Types.ObjectId | string,
    address: string,
    category: string
}