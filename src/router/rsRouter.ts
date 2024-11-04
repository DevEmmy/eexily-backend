import { Router } from "express";
import { Container } from "typedi";

import { verifyAuth } from "../middleware/verifyAuth";
import RSController from "../controllers/RSController";

const router = Router();
const rsController = Container.get(RSController);

router.post("/", verifyAuth, (req, res) => rsController.create(req, res));
router.get("/", verifyAuth, (req, res) => rsController.getByUser(req, res));
router.get("/by-gcode/:gcode", verifyAuth, (req, res) => rsController.getByGCode(req, res));
router.patch("/update-status/:id", verifyAuth, (req, res) => rsController.updateRefillSchedule(req, res));
router.patch("/update-status/by-station", verifyAuth, (req, res) => rsController.updateRefillStatus(req, res));
router.get("/by-status/:status", verifyAuth, (req, res) => rsController.getRefillScheduleByStatus(req, res))

export default router;