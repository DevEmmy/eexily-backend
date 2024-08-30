import { UserType } from "../enum/userTypes"

export interface userDto{
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

export interface createUserDto{
    firstName: string,
    lastName: string,
    email: string,
    password: string
    type: UserType,
    generatedOtp: string
    generatedOtpExpiration: Date
}

export interface UpdateUserDto{
    firstName: string,
    lastName: string,
    email: string,
    profilePicture: string
}

export interface UserLoginDto{
    email: string,
    password: string
}