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
import BusinessRepository from "../repositories/BusinessRepository";
import CustomerServiceRepository from "../repositories/CustomerServiceRepository";
import IndividualRepository from "../repositories/IndividualRepository";
import GasStationRepository from "../repositories/GasStationRepository";
import RiderRepository from "../repositories/RiderRepository";
import GasPredictionRepository from "../repositories/GasPrediction";
import GasPredictionService from "./GasPredictionServices";
import MerchantRepository from "../repositories/MerchantRepository";
import EmailService from "./EmailServices";

let jwtSecret = process.env.JWT_SECRET as string;

@Service()
export class UserServices {
    constructor(private readonly repo: UserRepository, private readonly gasRepo: GasRepository, private readonly otpService: OTPServices, private readonly businessServices: BusinessServices, private readonly csServices: CustomerServiceServices, private readonly gsServices: GasStationServices, private readonly individualServices: IndividualServices, private readonly riderServices: RiderServices, private readonly businessRepo: BusinessRepository, private readonly csRepo: CustomerServiceRepository, private readonly individualRepo: IndividualRepository, private readonly gasStationRepo: GasStationRepository, private readonly riderRepo: RiderRepository, private gasPredictionRepository: GasPredictionRepository, private readonly gasPredictionService: GasPredictionService, private readonly merchantRepository : MerchantRepository, private readonly emailService: EmailService) { };

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

            let typeData: any = {
                user,
                phoneNumber: data.phoneNumber
            }

            let typeObject;
            switch (type) {
                case UserType.BUSINESS:
                    typeObject = await this.businessServices.createBusiness(typeData);
                    break;
                case UserType.RIDER:
                    typeObject = await this.riderServices.create(typeData)
                    break;
                case UserType.CUSTOMER_SERVICE:
                    typeObject = await this.csServices.create(typeData);
                    break;
                case UserType.GAS_STATION:
                    typeObject = await this.gsServices.create(typeData)
                    break;
                case UserType.INDIVIDUAL:
                    typeObject = await this.individualServices.create(typeData)
                    break;
                case UserType.MERCHANT:
                    typeObject = await this.merchantRepository.create(typeData)
                    break;
            }

            // let gasObject: GasDto = { size, houseHoldSize, primaryCookingAppliance, ownedBy: String(user._id) };

            // let gas = await this.gasRepo.create(gasObject)

            let token = this.generateToken(String(user._id))


            return {
                payload: { user, token, typeObject }
            }
        }
        catch (err: any) {
            throw Error(err.message);
        }
    }

    async resendOtp(email: string){
        try{
            let user : any = await this.repo.findByEmail(email);

            if(!user){
                return {
                    message: "User not found."
                }
            }

            
            let otp = this.otpService.generateOTP()
            user.generatedOtp = await bcrypt.hash(String(otp), 8);
            const currentDate = new Date();
            user.generatedOtpExpiration = new Date(currentDate.getTime() + 5 * 60 * 60 * 1000);
            user = await this.repo.update(user._id, user);

            await this.otpService.sendCreateUserOTP(otp, email);

            return {
                payload: user,
                message: "Email Sent"
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

            if (user.isVerified !== true) {
                return { payload: null, message: "You're not verified yet!" }
            }

            let doMatch = await bcrypt.compare(password, user.password);
            if (!doMatch) {
                return { message: "Incorrect Password" }
            }
            let token = this.generateToken(String(user._id))

            let typeObject;

            switch (user.type) {
                case UserType.BUSINESS:
                    typeObject = await this.businessRepo.findOne({ user: user._id })
                    break;
                case UserType.CUSTOMER_SERVICE:
                    typeObject = await this.csRepo.findOne({ user: user._id })
                    break;
                case UserType.GAS_STATION:
                    typeObject = await this.gasStationRepo.findOne({ user: user._id })
                    break;
                case UserType.INDIVIDUAL:
                    typeObject = await this.individualRepo.findOne({ user: user._id })
                    break;
                case UserType.RIDER:
                    typeObject = await this.riderRepo.findOne({ user: user._id })
                    break;
                case UserType.MERCHANT:
                        typeObject = await this.merchantRepository.findOne({ user: user._id })
                        break;
            }

            let gasPrediction = await this.gasPredictionRepository.findByUser(user._id as string);
            let isGas = gasPrediction ? true : false
            let gasPredictionData;
            if (isGas) {
                gasPredictionData = await this.gasPredictionService.predictGasCompletion(user._id as string)
            }
            return {
                payload: { user, token, typeObject, isGas, gasPredictionData }
            }
        }

        catch (err: any) {
            throw Error(err.message);
        }
    }

    async getUserById(id: string) {

    }

    async completeProfile(userId: string, data: any) {
        let user = await this.repo.findById(userId);
        data.user = user

        let result: any;
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
                break;
        }

        return {
            payload: result,
            message: "Completed Successfully"
        }
    }

    async forgotPassword(email: string){
        try{
            let user = await this.repo.findByEmail(email);
            if(!user){
                return {
                    payload: null,
                    message: "There is no user with this Email",
                    status: 400
                }
            }

            let otp = this.otpService.generateOTP();
            user.resetToken = String(otp);
            // this.emailService.sendResetToken(user.email, user.resetToken)
            user.resetTokenExpiration = new Date(new Date().setHours(new Date().getHours() + 5))
            this.repo.update(String(user._id), user)
            await this.otpService.sendCreateUserOTP(otp, user.email);
            return {
                message: "Check your Email"
            }
        }
        catch (err: any) {
            throw Error(err.message);
        }
    }

    async updatePassword(token: string, newPassword: string){
        try{
            let user = await this.repo.findByToken(token);

            if(!user){
                return {
                    payload: null,
                    message: "Invalid Token",
                    status: 400
                }
            }

           user.password = await bcrypt.hash(newPassword, 8)
           user.resetToken = null;
            user = await this.repo.update(String(user._id), user);

            return {
                payload: user,
                message: "Password Updated!"
            }
        }
        catch (err: any) {
            throw Error(err.message);
        }
    }
}