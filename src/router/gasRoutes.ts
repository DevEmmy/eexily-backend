import { Router } from "express";
import { Container } from "typedi";
import GasController from "../controllers/GasController";
import { verifyAuth } from "../middleware/verifyAuth";

const router = Router();
const gasController = Container.get(GasController);

router.post("/", verifyAuth, (req, res) => gasController.createGas(req, res));
router.get("/:id", verifyAuth, (req, res) => gasController.getGasById(req, res));
router.get("/", verifyAuth, (req, res) => gasController.getAllGas(req, res));
router.put("/:id", verifyAuth, (req, res) => gasController.updateGas(req, res));
router.delete("/:id", verifyAuth, (req, res) => gasController.deleteGasById(req, res));
router.get("/appliance/:appliance", verifyAuth, (req, res) => gasController.findGasByAppliance(req, res));

export default router;