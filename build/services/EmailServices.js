"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const nodemailer_1 = __importDefault(require("nodemailer"));
require("reflect-metadata");
const typedi_1 = require("typedi");
require("dotenv").config();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
        user: String(process.env.EMAIL_ADDRESS),
        pass: String(process.env.EMAIL_TEST_PASSWORD)
    }
});
const registerHtml = (otp) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans&family=Rubik&display=swap" rel="stylesheet">

        <style>
    
        .bold{
            color: black;
            font-weight: 600;
            padding: 0;
        }
    
    </style>
    </head>
    
    <body>
       <p> Here's your OTP : <span class="bold">${otp}</span> </p>
        
    </body>
    </html>
    `;
};
let EmailService = class EmailService {
    constructor() {
    }
    mail(receiver, sender, subject, html) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: `${sender}<${process.env.EMAIL_ADDRESS}>`,
                to: receiver,
                subject: subject,
                html: html
            };
            transporter.sendMail(mailOptions, (error, info) => {
                console.log("sending...");
                if (error) {
                    console.log(error);
                }
                else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });
    }
    sendSignUpOTP(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            this.mail(email, "Emmy", "OTP - Confirm your Eexily User verification!", registerHtml(otp));
        });
    }
};
EmailService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], EmailService);
exports.default = EmailService;
