import { Service } from "typedi";
import CustomerService, { ICustomerService } from "../models/customerService";
import { BaseRepository } from "./BaseRepository";
import Individual, { IIndividual } from "../models/individual";

@Service()
class IndividualRepository extends BaseRepository<IIndividual>{
    constructor(){
            super(Individual)
    }
}

export default IndividualRepository