"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = require("typedi");
const verifyAuth_1 = require("../middleware/verifyAuth");
const NotificationController_1 = __importDefault(require("../controllers/NotificationController"));
const router = (0, express_1.Router)();
const notificationController = typedi_1.Container.get(NotificationController_1.default);
router.get("/", verifyAuth_1.verifyAuth, (req, res) => notificationController.getUsersNotification(req, res));
exports.default = router;
