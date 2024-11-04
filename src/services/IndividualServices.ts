import { Service } from "typedi";
import GasStationRepository from "../repositories/GasStationRepository";
import { IGasStation } from "../models/gasStation";
import IndividualRepository from "../repositories/IndividualRepository";
import { IIndividual } from "../models/individual";

@Service()
class IndividualServices{
    constructor(private readonly repository : IndividualRepository){}

    async create(data: IIndividual){
        return {payload: await this.repository.create(data)};
    }

    async getAll(){
        return {payload : await this.repository.find()}
    }

    async getById(_id: string){
        return {payload : await this.repository.findOne({_id})}
    }

    async getByUser(user: string){
        return {payload: await this.repository.find({user})}
    }

    async update(user: string, data: Partial<IIndividual>){
        let payload = await this.repository.update({user}, data);
        return {payload};
    }
}

export default IndividualServices