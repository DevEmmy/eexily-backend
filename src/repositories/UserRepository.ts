import { Service } from "typedi"
import User from "../models/user"
import { UpdateUserDto, userDto } from "../interfaces/user";
import "reflect-metadata";


@Service()
class UserRepository{
    constructor(
        private readonly model = User,
    ){}

    async create(data: userDto){
        const result = await new this.model(data).save();
        return result;
    }

    async findById(id: string){
        const result = await this.model.findById(id);
        return result;
    }

    async findByEmail(email: string){
        const result = await this.model.findOne({email});
        return result;
    }

    async findAll(){
        const result : userDto[] = await this.model.find();
        return result;
    }

    async update(id: string, data: any){
        const result = await this.model.findByIdAndUpdate(id, data, {new: true});
        return result;
    }
}

export default UserRepository;