import { Service } from "typedi";
import Gas, { IGas } from "../models/gas";
import { GasDto, UpdateGasDto } from "../interfaces/gas";
import "reflect-metadata";
import { Types } from "mongoose";

@Service()
class GasRepository {
    constructor(
        private readonly model = Gas,
    ) { }

    async create(data: GasDto) {
        const result = await new this.model(data).save();
        return result;
    }

    async findById(id: string) {
        const result = await this.model.findById(id);
        return result;
    }

    async findAll() {
        const result: GasDto[] = await this.model.find();
        return result;
    }

    async update(id: string, data: UpdateGasDto) {
        const result = await this.model.findByIdAndUpdate(id, data, { new: true });
        return result;
    }

    async deleteById(id: string) {
        const result = await this.model.findByIdAndDelete(id);
        return result;
    }

    async findByAppliance(appliance: string) {
        const result = await this.model.findOne({ primaryCookingAppliance: appliance });
        return result;
    }

    async findByOwner(ownerId: string){
        const result = await this.model.findOne({ownedBy: ownerId}).populate("ownedBy")
        return result
    }

     // Method to track usage by day
  async trackUsageByDay(gasId: string, day: number, month: number, year: number) {
    const startDate = new Date(year, month - 1, day);
    const endDate = new Date(year, month - 1, day + 1);

    const gas = await this.model.aggregate([
      { $match: { _id: gasId } },
      { $unwind: '$usage' },
      {
        $match: {
          'usage.usedAt': { $gte: startDate, $lt: endDate }
        }
      },
      {
        $group: {
          _id: '$size', // Grouping by size, you can customize this as needed
          totalUsage: { $sum: '$usage.amountUsed' },
          usageDetails: { $push: '$usage' }
        }
      }
    ]);

    return gas;
  }
  
  // Get daily usage within a specific month
  async getDailyUsage(userId: Types.ObjectId | string, month: number, year: number): Promise<IGas[]> {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    return this.model.aggregate([
      { $match: { ownedBy:new Types.ObjectId(userId), 'usage.usedAt': { $gte: startOfMonth, $lte: endOfMonth } } },
      { $unwind: '$usage' },
      { $match: { 'usage.usedAt': { $gte: startOfMonth, $lte: endOfMonth } } },
      { $sort: { 'usage.usedAt': 1 } },
      {
        $group: {
          _id: { day: { $dayOfMonth: '$usage.usedAt' }, month: { $month: '$usage.usedAt' }, year: { $year: '$usage.usedAt' } },
          usage: { $push: '$usage' },
        },
      },
      { $sort: { '_id.day': 1 } },
    ]);
  }

  // Get weekly usage within a specific month
  async getWeeklyUsage(userId: Types.ObjectId | string, month: number, year: number): Promise<IGas[]> {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    return this.model.aggregate([
      { $match: { ownedBy:new Types.ObjectId(userId), 'usage.usedAt': { $gte: startOfMonth, $lte: endOfMonth } } },
      { $unwind: '$usage' },
      { $match: { 'usage.usedAt': { $gte: startOfMonth, $lte: endOfMonth } } },
      { $sort: { 'usage.usedAt': 1 } },
      {
        $group: {
          _id: { week: { $week: '$usage.usedAt' }, year: { $year: '$usage.usedAt' } },
          usage: { $push: '$usage' },
        },
      },
      { $sort: { '_id.week': 1 } },
    ]);
  }

  // Get monthly usage within a specific year
  async getMonthlyUsage(userId: Types.ObjectId | string, year: number): Promise<IGas[]> {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

    return this.model.aggregate([
      { $match: { ownedBy: new Types.ObjectId(userId), 'usage.usedAt': { $gte: startOfYear, $lte: endOfYear } } },
      { $unwind: '$usage' },
      { $match: { 'usage.usedAt': { $gte: startOfYear, $lte: endOfYear } } },
      { $sort: { 'usage.usedAt': 1 } },
      {
        $group: {
          _id: { month: { $month: '$usage.usedAt' }, year: { $year: '$usage.usedAt' } },
          usage: { $push: '$usage' },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);
  }
}

export default GasRepository;
