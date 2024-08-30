import { Service } from "typedi";
import BusinessRepository from "../repositories/BusinessRepository";
import { BusinessInterface } from "../interfaces/business";
import CustomerServiceRepository from "../repositories/CustomerServiceRepository";
import { ICustomerService } from "../models/customerService";

@Service()
class CustomerServiceServices{
    constructor(private readonly repository : CustomerServiceRepository){}

    async create(data: ICustomerService){
        return this.repository.create(data);
    }

    async getAllCustomers(){
        return this.repository.find()
    }
}

export default CustomerServiceServices