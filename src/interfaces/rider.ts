import { Types } from "mongoose";
import { RiderType } from "../models/rider";

export interface RiderInterface{
    user: Types.ObjectId;
    driverLicense?: string;
    expiryDate?: Date;
    riderType: RiderType;
    workPlaceAddress?: string;
    profilePicture?: string;
    gasStation: any
    gasStationCode: string
}