import { Router } from "express";
import { Container } from "typedi";
import { verifyAuth } from "../middleware/verifyAuth";  // Ensure you have this middleware for authentication
import ExpressRefillController from "../controllers/ExpressRefillController";

const router = Router();
const expressRefillController = Container.get(ExpressRefillController);

// Route for creating a refill
router.post("/", verifyAuth, (req, res) => expressRefillController.create(req, res));

// Route for getting orders by rider
router.get("/rider/:rider", verifyAuth, (req, res) => expressRefillController.getOrdersByRider(req, res));

// Route for getting orders by merchant
router.get("/merchant/:merchantId", verifyAuth, (req, res) => expressRefillController.getOrdersByMerchant(req, res));

// Route for getting orders by gas station
router.get("/gasStation/:id", verifyAuth, (req, res) => expressRefillController.getOrdersByMerchant(req, res));

// Route for updating status by merchant
router.patch("/status/:gcode", verifyAuth, (req, res) => expressRefillController.updateStatus(req, res));

export default router;
