import { Service } from "typedi";
import Gas from "../models/gas";
import { GasDto, UpdateGasDto } from "../interfaces/gas";
import "reflect-metadata";

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
}

export default GasRepository;
