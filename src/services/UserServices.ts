import { UserLoginDto, createUserDto, userDto } from "../interfaces/user";
import UserRepository from "../repositories/UserRepository";
import jwt from "jsonwebtoken"
require("dotenv").config();
import bcrypt from "bcrypt"
import "reflect-metadata";
import { Service } from "typedi";
import mongoose from "mongoose";
import GasRepository from "../repositories/GasRepository";
import { GasDto } from "../interfaces/gas";
import { OTPServices } from "./OtpServices";
import { UserType } from "../enum/userTypes";
import BusinessServices from "./BusinessServices";
import CustomerServiceServices from "./CustomerServiceServices";
import GasStationServices from "./GasStationServices";
import IndividualServices from "./IndividualServices";
import RiderServices from "./RiderServices";
import { BusinessInterface } from "../interfaces/business";

let jwtSecret = process.env.JWT_SECRET as string;

@Service()
export class UserServices {
    constructor(private readonly repo: UserRepository, private readonly gasRepo: GasRepository, private readonly otpService: OTPServices, private readonly businessServices: BusinessServices,private readonly csServices : CustomerServiceServices,private readonly gsServices: GasStationServices,private readonly individualServices: IndividualServices,private readonly riderServices: RiderServices) { };

    generateToken(id: string) {
        let token = jwt.sign({ id }, jwtSecret)
        return token;
    }

    async signUp(data: createUserDto) {
        try {
            let { email, password, type } = data;
            // let { size, houseHoldSize, primaryCookingAppliance } = data;

            let checkUser = await this.repo.findByEmail(email);
            if (checkUser) {
                return { message: "User with this email already exists." }
            }

            data.password = await bcrypt.hash(password, 8);

            let otp = this.otpService.generateOTP()
            data.generatedOtp = await bcrypt.hash(String(otp), 8);

            //set date
            const currentDate = new Date();

            data.generatedOtpExpiration = new Date(currentDate.getTime() + 5 * 60 * 60 * 1000);


            let user = await this.repo.create(data);

            //send otp
            await this.otpService.sendCreateUserOTP(otp, email);

            let typeData : any= {
                user
            }
            switch (type) {
                case  UserType.BUSINESS:
                    await this.businessServices.createBusiness(typeData);
                case UserType.RIDER:
                    await this.riderServices.create(typeData)
                case UserType.CUSTOMER_SERVICE:
                    await this.csServices.create(typeData);
                case UserType.GAS_STATION:
                    await this.gsServices.create(typeData)
                case UserType.INDIVIDUAL:
                    await this.individualServices.create(typeData)
                    break;
            
                default:
                    await this.individualServices.create(typeData)
                    break;
            }

            // let gasObject: GasDto = { size, houseHoldSize, primaryCookingAppliance, ownedBy: String(user._id) };

            // let gas = await this.gasRepo.create(gasObject)
            
            return {
                payload: { user }
            }
        }
        catch (err: any) {
            throw Error(err.message);
        }
    }

    async verifyOtp(otp: number, email: string) {
        try {
            let user: any = await this.repo.findByEmail(email);
            if (!user) {
                return {
                    payload: null,
                    message: "Email not found"
                }
            }

            // if (user.generatedOtpExpiration > new Date()) {
            //     return {
            //         payload: null,
            //         message: "OTP Expired"
            //     }
            // }


            let doMatch = await bcrypt.compare(String(otp), user.generatedOtp);
            if (!doMatch) {
                return { message: "Incorrect OTP", payload: null }
            }

            user.isVerified = true;
            user.generatedOtp = null
            user.generatedOtpExpiration = null
            user = await this.repo.update(user._id, user)
            let gas = await this.gasRepo.findByOwner(user._id);

            let token = this.generateToken(String(user._id))
            return {
                payload: { user, gas, token }
            }
        }
        catch (err: any) {
            throw Error(err.message);
        }
    }

    async signIn(data: UserLoginDto) {
        try {
            let { email, password } = data;
            let user = await this.repo.findByEmail(email)

            if (!user) {
                return { message: "User with this email does not exist" }
            }

            if(user.isVerified !== true){
                return {payload: null, message: "You're not verified yet!"}
            }

            let doMatch = await bcrypt.compare(password, user.password);
            if (!doMatch) {
                return { message: "Incorrect Password" }
            }
            let token = this.generateToken(String(user._id))
            return {
                payload: { user, token }
            }
        }

        catch (err: any) {
            throw Error(err.message);
        }
    }

    async getUserById(id: string) {

    }


    async completeProfile(userId : string, data: any){
        let user = await this.repo.findById(userId);
        data.user = user
        
        let result : any;
        switch (user?.type) {
            case UserType.BUSINESS:
                result = await this.businessServices.createBusiness(data)
                break;

            case UserType.CUSTOMER_SERVICE:
                    result = await this.csServices.create(data)
                    break;

            case UserType.GAS_STATION:
                     result = await this.gsServices.create(data)
                     break;

            case UserType.INDIVIDUAL:
                    result = await this.individualServices.create(data)
                    break;

            case UserType.RIDER:
                    result = await this.riderServices.create(data)
                    break;
        
            default:
                result = null;
        }

        return {
            payload: result,
            message: "Completed Successfully"
        }
    }

}