import { Service } from "typedi";
import EmailService from "./EmailServices";

@Service()
export class OTPServices{
    constructor(private readonly emailService: EmailService){}

    generateOTP(): number {
        const otp = Math.floor(10000 + Math.random() * 90000);
        return otp;
    }

    async sendCreateUserOTP(otp: number, email: string){
        try{
            await this.emailService.sendSignUpOTP(email, otp)
        }
        catch(err){
            console.log(err);
        }
    }
}