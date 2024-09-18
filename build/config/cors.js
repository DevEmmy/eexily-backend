"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const whitelist = [
    'http://localhost:3000',
    'http://127.0.0.0.1:3000',
    'https://your-site.com'
];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};
exports.default = corsOptions;
