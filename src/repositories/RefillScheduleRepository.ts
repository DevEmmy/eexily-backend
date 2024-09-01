import RefillSchedule, { IRefillSchedule } from "../models/refillSchedule";
import { BaseRepository } from "./BaseRepository";

class RefillScheduleRepository extends BaseRepository<IRefillSchedule>{
    constructor(){
        super(RefillSchedule)
    }
}

export default RefillScheduleRepository