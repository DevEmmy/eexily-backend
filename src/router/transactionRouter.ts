import { Router } from "express";
import { Container } from "typedi";
import { TransactionController } from "../controllers/TransactionController";
import { verifyAuth } from "../middleware/verifyAuth";


const router = Router();
const transactionController = Container.get(TransactionController);

router.post("/initialize", verifyAuth, (req, res) => transactionController.initializePayment(req, res));
router.get("/verify", (req, res) => transactionController.verifyPayment(req, res));
router.get("/merchant/:merchantId/revenue", verifyAuth, (req, res) => transactionController.getMerchantRevenue(req, res));
router.get("/user/history", verifyAuth, (req, res) => transactionController.getUserTransactions(req, res));

export default router;
