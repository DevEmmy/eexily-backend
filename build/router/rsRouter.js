"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = require("typedi");
const verifyAuth_1 = require("../middleware/verifyAuth");
const RSController_1 = __importDefault(require("../controllers/RSController"));
const router = (0, express_1.Router)();
const rsController = typedi_1.Container.get(RSController_1.default);
router.post("/", verifyAuth_1.verifyAuth, (req, res) => rsController.create(req, res));
router.get("/:userId", verifyAuth_1.verifyAuth, (req, res) => rsController.getByUser(req, res));
router.get("/by-gcode/:gcode", verifyAuth_1.verifyAuth, (req, res) => rsController.getByGCode(req, res));
router.patch("/update-status/:id", verifyAuth_1.verifyAuth, (req, res) => rsController.updateRefillSchedule(req, res));
router.patch("/update-status/by-station", verifyAuth_1.verifyAuth, (req, res) => rsController.updateRefillStatus(req, res));
router.get("/by-status/:status", verifyAuth_1.verifyAuth, (req, res) => rsController.getRefillScheduleByStatus(req, res));
exports.default = router;
