import mongoose from "mongoose";
import Transaction, { ITransaction } from "../models/transaction";
import { BaseRepository } from "./BaseRepository";
import { Service } from "typedi";

@Service()
class TransactionRepository extends BaseRepository<ITransaction>{
    constructor(){
        super(Transaction)
    }

    async findTransactionByReference(reference: string): Promise<ITransaction | null> {
        return await Transaction.findOne({ reference });
      }
    
      async findUserTransactions(userId: string): Promise<ITransaction[]> {
        return await Transaction.find({ user: userId }).populate("merchant").populate("rider");
      }
    
      async calculateMerchantRevenue(merchantId: string): Promise<number> {
        const result = await Transaction.aggregate([
          { $match: { merchant: new mongoose.Types.ObjectId(merchantId), status: "success" } },
          { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
        ]);
        return result[0]?.totalRevenue || 0;
      }
    
      async calculateRiderRevenue(riderId: string): Promise<number> {
        const result = await Transaction.aggregate([
          { $match: { rider: new mongoose.Types.ObjectId(riderId), status: "success" } },
          { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
        ]);
        return result[0]?.totalRevenue || 0;
      }
}   

export default TransactionRepository