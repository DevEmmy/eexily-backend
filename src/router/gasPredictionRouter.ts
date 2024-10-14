import { Router } from "express";
import { Container } from "typedi";
import GasPredictionController from "../controllers/GasPredictionController";

const router = Router();
const gasPredictionController = Container.get(GasPredictionController);

// Update the gas refill history and last refill date
router.post("/user/:userId/refill", (req, res, next) => gasPredictionController.updateGasRefill(req, res, next));

// Other routes remain unchanged
router.post("/", (req, res, next) => gasPredictionController.createGasPrediction(req, res, next));
router.get("/user/:userId", (req, res, next) => gasPredictionController.getUserGasPredictions(req, res, next));


export default router;
