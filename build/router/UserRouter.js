"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = __importDefault(require("typedi"));
const UserController_1 = require("../controllers/UserController");
const express_1 = __importDefault(require("express"));
const verifyAuth_1 = require("../middleware/verifyAuth");
const router = (0, express_1.default)();
const userController = typedi_1.default.get(UserController_1.UserController);
router.post("/sign-in", (req, res) => userController.signIn(req, res));
router.post("/verify-user", (req, res) => userController.verifyOtp(req, res));
router.post("/sign-up", (req, res) => userController.signUp(req, res));
router.post("/complete-registration", verifyAuth_1.verifyAuth, (req, res) => userController.signUp(req, res)); //add middleware
exports.default = router;
