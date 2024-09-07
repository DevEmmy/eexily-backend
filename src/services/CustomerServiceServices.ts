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

    async updateCustomer(user: string, data: Partial<ICustomerService>){
        try{
            let customer = await this.repository.findOne({user})
            if(!customer){
                return {
                    message: "Customer Service not Found"
                }
            }

            let updatedData = await this.repository.update({user}, data)
            return {
                payload: updatedData,
                message: "Updated"
            }
        }
        catch(err: any){
            throw new Error(err)
        }
    }

    async getByUser(user: string){
        return {
            payload: await this.repository.findOne({user})
        }
    }
}

export default CustomerServiceServices