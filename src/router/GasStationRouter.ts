import { Router } from "express";
import { Container } from "typedi";
import { verifyAuth } from "../middleware/verifyAuth";
import RSController from "../controllers/RSController";
import GasStation from "../models/gasStation";
import GasStationController from "../controllers/GasStationController";

const router = Router();
const gasStationController = Container.get(GasStationController);

router.post("/", verifyAuth, (req, res) => gasStationController.create(req, res));
router.get("/:userId", verifyAuth, (req, res) => gasStationController.getByUser(req, res));
router.get("/by-regcode/:regCode", verifyAuth, (req, res) => gasStationController.getByRegcode(req, res));
router.patch("/update/:id", verifyAuth, (req, res) => gasStationController.update(req, res));
router.get("/", verifyAuth, (req, res) => gasStationController.getAll(req, res))

export default router;