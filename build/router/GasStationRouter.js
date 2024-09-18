"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = require("typedi");
const verifyAuth_1 = require("../middleware/verifyAuth");
const GasStationController_1 = __importDefault(require("../controllers/GasStationController"));
const router = (0, express_1.Router)();
const gasStationController = typedi_1.Container.get(GasStationController_1.default);
router.post("/", verifyAuth_1.verifyAuth, (req, res) => gasStationController.create(req, res));
router.get("/:userId", verifyAuth_1.verifyAuth, (req, res) => gasStationController.getByUser(req, res));
router.get("/by-regcode/:regCode", verifyAuth_1.verifyAuth, (req, res) => gasStationController.getByRegcode(req, res));
router.patch("/update/:id", verifyAuth_1.verifyAuth, (req, res) => gasStationController.update(req, res));
router.get("/", verifyAuth_1.verifyAuth, (req, res) => gasStationController.getAll(req, res));
exports.default = router;
