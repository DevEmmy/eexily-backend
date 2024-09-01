import { Router } from "express";
import { Container } from "typedi";

import { verifyAuth } from "../middleware/verifyAuth";
import NotificationController from "../controllers/NotificationController";

const router = Router();
const notificationController = Container.get(NotificationController);

router.get("/:id", verifyAuth, (req, res) => notificationController.getUsersNotification(req, res));

export default router;