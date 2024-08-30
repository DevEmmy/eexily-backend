import { Service } from "typedi";
import RiderRepository from "../repositories/RiderRepository";
import { IRider } from "../models/rider";
import { RiderInterface } from "../interfaces/rider";

@Service()
class RiderServices{
    constructor(private readonly repository : RiderRepository){}

    async create(data: RiderInterface){
        return this.repository.create(data);
    }

    async getAll(){
        return this.repository.find()
    }
}

export default RiderServices