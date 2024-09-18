"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuth = void 0;
require("dotenv").config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let jwtSecret = process.env.JWT_SECRET;
const verifyAuth = (request, response, next) => {
    try {
        const authorization = request.headers.authorization;
        let token = authorization.replace("Bearer ", "");
        if (token) {
            let payload = jsonwebtoken_1.default.verify(token, jwtSecret);
            if (!payload) {
                return response.status(400).json({ message: "User not Authorized" });
            }
            request.body.user = payload.id;
            next();
            return null;
        }
        else {
            return response.status(400).json({ message: "User not Authorized" });
        }
    }
    catch (err) {
        return response.status(400).json({ message: err.message });
    }
};
exports.verifyAuth = verifyAuth;
