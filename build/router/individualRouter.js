"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = require("typedi");
const verifyAuth_1 = require("../middleware/verifyAuth");
const IndividualController_1 = __importDefault(require("../controllers/IndividualController"));
const router = (0, express_1.Router)();
const individualController = typedi_1.Container.get(IndividualController_1.default);
router.post("/", verifyAuth_1.verifyAuth, (req, res) => individualController.create(req, res));
router.get("/", verifyAuth_1.verifyAuth, (req, res) => individualController.getAll(req, res));
router.get("/:id", verifyAuth_1.verifyAuth, (req, res) => individualController.getById(req, res));
router.get("/by-user/:user", verifyAuth_1.verifyAuth, (req, res) => individualController.getByUser(req, res));
router.patch("/:id", verifyAuth_1.verifyAuth, (req, res) => individualController.update(req, res));
exports.default = router;
