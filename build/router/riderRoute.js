"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = require("typedi");
const verifyAuth_1 = require("../middleware/verifyAuth");
const RiderController_1 = __importDefault(require("../controllers/RiderController"));
const router = (0, express_1.Router)();
const riderController = typedi_1.Container.get(RiderController_1.default);
router.post("/", verifyAuth_1.verifyAuth, (req, res) => riderController.createRider(req, res));
router.get("/", verifyAuth_1.verifyAuth, (req, res) => riderController.getAllRiders(req, res));
router.get("/by-gasstation/:gasStation", verifyAuth_1.verifyAuth, (req, res) => riderController.getRidersByGasStation(req, res));
router.get("/schedule/:riderId", verifyAuth_1.verifyAuth, (req, res) => riderController.getRiderSchedule(req, res));
router.patch("/update/:riderId", verifyAuth_1.verifyAuth, (req, res) => riderController.getRiderSchedule(req, res));
exports.default = router;
