import { Service } from "typedi";
import CustomerService, { ICustomerService } from "../models/customerService";
import { BaseRepository } from "./BaseRepository";
import Rider, { IRider } from "../models/rider";

@Service()
class RiderRepository extends BaseRepository<IRider>{
    constructor(){
            super(Rider)
    }
}

export default RiderRepository