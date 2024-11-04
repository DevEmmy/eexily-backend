import { Service } from "typedi";
import ExpressRefill, { IExpressRefill } from "../models/expressRefill"; // Assuming `expressRefill` model is similar to `refillSchedule`
import { BaseRepository } from "./BaseRepository";
import { Types } from "mongoose";

@Service()
class ExpressRefillRepository extends BaseRepository<IExpressRefill> {
  constructor() {
    super(ExpressRefill);
  }

  async getByGcode(gcode: string) {
    return await this.model.findOne({ gcode });
  }

  async getRefillByUser(user: string | Types.ObjectId) {
    return await this.model.find({ user });
  }

  async getRefillByStatus(status: string, user?: string | Types.ObjectId) {
    if (user) {
      return await this.model.find({ status, user });
    }
    return await this.model.find({ status });
  }

  async getRefillByMerchant(merchant: string | Types.ObjectId) {
    return await this.model.find({ merchant });
  }

  async getRefillByRider(rider: string | Types.ObjectId) {
    return await this.model.find({ rider });
  }
}

export default ExpressRefillRepository;
