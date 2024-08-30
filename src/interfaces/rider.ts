import { Types } from "mongoose";

export interface RiderInterface{
    user: Types.ObjectId;
    driverLicense?: string;
    expiryDate?: Date;
    workPlaceAddress?: string;
    profilePicture?: string;
}