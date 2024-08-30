import { Service } from "typedi";
import CustomerService, { ICustomerService } from "../models/customerService";
import { BaseRepository } from "./BaseRepository";

@Service()
class CustomerServiceRepository extends BaseRepository<ICustomerService>{
    constructor(){
            super(CustomerService)
    }
}

export default CustomerServiceRepository