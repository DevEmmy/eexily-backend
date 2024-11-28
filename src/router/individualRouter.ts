import { Router } from "express";
import { Container } from "typedi";
import { verifyAuth } from "../middleware/verifyAuth";
import IndividualController from "../controllers/IndividualController";

const router = Router();
const individualController = Container.get(IndividualController);

router.post("/", verifyAuth, (req, res) => individualController.create(req, res));
router.get("/", verifyAuth, (req, res) => individualController.getAll(req, res));
router.get("/:id", verifyAuth, (req, res) => individualController.getById(req, res));
router.get("/by-user/:user", verifyAuth, (req, res) => individualController.getByUser(req, res));
router.patch("/", verifyAuth, (req, res) => individualController.update(req, res));

export default router;
