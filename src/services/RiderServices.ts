import { Service } from "typedi";
import RiderRepository from "../repositories/RiderRepository";
import { IRider } from "../models/rider";
import { RiderInterface } from "../interfaces/rider";

@Service()
class RiderServices{
    constructor(private readonly repository : RiderRepository){}

    async create(data: RiderInterface){
        let payload = await this.repository.create(data);
        return {payload}
    }

    async getAll(){
        let payload = await this.repository.find()
        return {payload}
    }
}

export default RiderServices