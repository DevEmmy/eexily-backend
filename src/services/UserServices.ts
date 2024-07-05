import { UserLoginDto, userDto } from "../dto/user-dto";
import UserRepository from "../repositories/UserRepository";
import jwt from "jsonwebtoken"
require("dotenv").config();
import bcrypt from "bcrypt"
import "reflect-metadata";
import { Service } from "typedi";
import mongoose from "mongoose";

let jwtSecret = process.env.JWT_SECRET as string;

@Service()
export class UserServices {
    constructor(private readonly repo: UserRepository) { };

    generateToken(id: string) {
        let token = jwt.sign({ id }, jwtSecret)
        return token;
    }

    async signUp(data: userDto) {
        try {
            let { email, password } = data;

            let checkUser = await this.repo.findByEmail(email);
            if(checkUser){
                return {message: "User with this email already exists."}
            }

            data.password = await bcrypt.hash(password, 8);
            let user = await this.repo.create(data);
            let token = this.generateToken(String(user._id))
            return {
                payload: {user, token}
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
            
            if(!user){
                return {message: "User with this email does not exist"}
            }

            let doMatch = await bcrypt.compare(password, user.password, );
            if(!doMatch){
                return {message: "Incorrect Password"}
            }
            let token = this.generateToken(String(user._id))
            return {
                payload: {user, token}
            }
        }

        catch (err: any) {
            throw Error(err.message);
        }
    }

    async getUserById(id: string) {

    }

  

}