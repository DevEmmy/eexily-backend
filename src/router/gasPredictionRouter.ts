import { Router } from "express";
import { Container } from "typedi";
import GasPredictionController from "../controllers/GasPredictionController";
import { verifyAuth } from "../middleware/verifyAuth";

const router = Router();
const gasPredictionController = Container.get(GasPredictionController);

// Update the gas refill history and last refill date
router.patch("/refill", verifyAuth, (req, res, next) => gasPredictionController.updateGasRefill(req, res, next));
router.patch("/", verifyAuth, (req, res, next) => gasPredictionController.update(req, res));
router.patch("/toggle", verifyAuth, (req, res, next) => gasPredictionController.togglePausePrediction(req, res));
// Other routes remain unchanged
router.post("/",verifyAuth ,(req, res, next) => gasPredictionController.createGasPrediction(req, res, next));
router.get("/user", verifyAuth, (req, res, next) => gasPredictionController.getUserGasPredictions(req, res, next));


export default router;
