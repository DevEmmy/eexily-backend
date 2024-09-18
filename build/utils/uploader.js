"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploaderListOfMedia = exports.uploader = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
require("dotenv").config();
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});
const uploader = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let url = (yield cloudinary_1.default.v2.uploader.upload(data)).secure_url;
    return url;
});
exports.uploader = uploader;
const uploaderListOfMedia = (arr) => __awaiter(void 0, void 0, void 0, function* () {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        newArr.push(yield (0, exports.uploader)(arr[i].base64));
    }
    return newArr;
});
exports.uploaderListOfMedia = uploaderListOfMedia;
