import { Service } from "typedi";
import GasStationRepository from "../repositories/GasStationRepository";
import { IGasStation } from "../models/gasStation";
import IndividualRepository from "../repositories/IndividualRepository";
import { IIndividual } from "../models/individual";

@Service()
class IndividualServices{
    constructor(private readonly repository : IndividualRepository){}

    async create(data: IIndividual){
        return this.repository.create(data);
    }

    async getAll(){
        return this.repository.find()
    }
}

export default IndividualServices