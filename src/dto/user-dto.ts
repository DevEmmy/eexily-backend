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
    size: string,
    houseHoldSize: number,
    primaryCookingAppliance: string
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