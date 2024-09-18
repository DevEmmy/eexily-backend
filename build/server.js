"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
require("dotenv").config();
const UserRouter_1 = __importDefault(require("./router/UserRouter"));
const gasRoutes_1 = __importDefault(require("./router/gasRoutes"));
const notificationRouter_1 = __importDefault(require("./router/notificationRouter"));
const rsRouter_1 = __importDefault(require("./router/rsRouter"));
const individualRouter_1 = __importDefault(require("./router/individualRouter"));
const riderRoute_1 = __importDefault(require("./router/riderRoute"));
const GasStationRouter_1 = __importDefault(require("./router/GasStationRouter"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const app = (0, express_1.default)();
const port = String(process.env.PORT) || 3030;
// Set up your routes and middleware here
// Set up your routes and middleware here
app.use((0, cors_1.default)({
    origin: "*"
}));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb' }));
const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Eexily API",
            version: "0.1.0",
            description: "This is the docs for all APIs for Eexily",
        },
        servers: [
            {
                url: "https://eexily-backend.onrender.com",
            },
        ],
    },
    apis: ["./docs/*.ts"],
};
const specs = (0, swagger_jsdoc_1.default)(options);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs, { explorer: true,
    customCssUrl: "https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css",
}));
// Run MongoDB
mongoose_1.default.connect(process.env.MONGODB_URI);
const connection = mongoose_1.default.connection;
connection.once('open', () => { console.log('Database running Successfully'); });
app.use("/auth", UserRouter_1.default);
app.use("/gas", gasRoutes_1.default);
app.use("/notifications", notificationRouter_1.default);
app.use("/refill-schedule", rsRouter_1.default);
app.use("/gas-station", GasStationRouter_1.default);
app.use("/individual", individualRouter_1.default);
app.use("/rider", riderRoute_1.default);
//render the html file
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html');
// });
app.get('/test-hardware', (req, res) => {
    res.json({ message: "Test Successfull" });
});
// Run Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
