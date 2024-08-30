import { Service } from "typedi";
import BusinessRepository from "../repositories/BusinessRepository";
import { BusinessInterface } from "../interfaces/business";

@Service()
class BusinessServices{
    constructor(private readonly repository : BusinessRepository){}

    async createBusiness(businessData: BusinessInterface){
        return this.repository.create(businessData);
    }

    async getAllBusiness(){
        return this.repository.find()
    }
}

export default BusinessServices