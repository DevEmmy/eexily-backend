import { Service } from "typedi";
import Business, { IBusiness } from "../models/business";
import { BaseRepository } from "./BaseRepository";

@Service()
class BusinessRepository extends BaseRepository<IBusiness> {
    constructor() {
      super(Business);
    }
  }

  export default BusinessRepository