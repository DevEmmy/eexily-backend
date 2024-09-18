import { Router } from "express";
import { Container } from "typedi";

import { verifyAuth } from "../middleware/verifyAuth";
import RiderController from "../controllers/RiderController";

const router = Router();
const riderController = Container.get(RiderController);

router.post("/", verifyAuth, (req, res) => riderController.createRider(req, res));
router.get("/", verifyAuth, (req, res) => riderController.getAllRiders(req, res));
router.get("/by-gasstation/:gasStation", verifyAuth, (req, res) => riderController.getRidersByGasStation(req, res));
router.get("/schedule/:riderId", verifyAuth, (req, res) => riderController.getRiderSchedule(req, res));
router.patch("/update/:riderId", verifyAuth, (req, res) => riderController.getRiderSchedule(req, res));

export default router;
