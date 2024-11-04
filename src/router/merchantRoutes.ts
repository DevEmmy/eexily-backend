import { Router } from "express";
import { Container } from "typedi";
import MerchantController from "../controllers/MerchantController";
import { verifyAuth } from "../middleware/verifyAuth";

const router = Router();
const merchantController = Container.get(MerchantController);

// Create a new merchant
router.post("/", verifyAuth, (req, res) => merchantController.createMerchant(req, res));

// Get all merchants
router.get("/", verifyAuth, (req, res) => merchantController.getAllMerchants(req, res));

// Get a merchant by ID
router.get("/:id", verifyAuth, (req, res) => merchantController.getMerchantById(req, res));

// Get a merchant by store name
router.get("/store/:storeName", verifyAuth, (req, res) => merchantController.getMerchantByStoreName(req, res));

// Get all open merchants
router.get("/open", verifyAuth, (req, res) => merchantController.getOpenMerchants(req, res));

// Update a merchant's information
router.patch("/:id", verifyAuth, (req, res) => merchantController.updateMerchant(req, res));

// Update merchant's open status
router.put("/:id/open", verifyAuth, (req, res) => merchantController.updateOpenStatus(req, res));

// Update merchant's pricing details
router.put("/:id/pricing", verifyAuth, (req, res) => merchantController.updatePricing(req, res));

// Delete a merchant by ID
router.delete("/:id", verifyAuth, (req, res) => merchantController.deleteMerchantById(req, res));

export default router;
