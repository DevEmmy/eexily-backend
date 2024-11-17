import express,  { Application, Request, Response } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import corsOptions from './config/cors';
require("dotenv").config()
import userRouter from "./router/UserRouter"
import gasRouter from "./router/gasRoutes"
import notificationRouter from "./router/notificationRouter"
import refillScheduleRouter from "./router/rsRouter"
import individualRouter from "./router/individualRouter"
import riderRouter  from "./router/riderRoute"
import gasStationRouter from "./router/GasStationRouter"
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from "swagger-ui-express"
import predictionRouter from "./router/gasPredictionRouter"
import { requestLogger } from './requestLogger';
import fs from 'fs';
import path from 'path';
import merchantRouter from "./router/merchantRoutes"
import expressRefillRouter from "./router/expressRefillRouter"
import { configureSocket } from './config/socket';
import { createServer } from "http";
import { Socket } from 'socket.io';
import GasPredictionCron from './services/GasPredictionCron';
import Container from 'typedi';

const app = express();
const port = String(process.env.PORT) || 3030;

app.use(requestLogger);

// Route to serve logs as HTML
app.get('/logs', (req: Request, res: Response) => {
  const logFilePath = path.join(__dirname ,'logs.txt');
  
  fs.readFile(logFilePath, 'utf-8', (err, data) => {
      if (err) {
          return res.status(500).send("Error reading log file.");
      }
      
      // Format the logs into HTML
      const htmlContent = `
      <html>
      <head>
          <title>Logs</title>
          <style>
              body { font-family: Arial, sans-serif; }
              pre { background-color: #f4f4f4; padding: 10px; border: 1px solid #ddd; }
          </style>
      </head>
      <body>
          <h1>Application Logs</h1>
          <pre>${data}</pre>
      </body>
      </html>
      `;
      
      res.send(htmlContent);
  });
});


app.use(cors({
  origin: "*"
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }))

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Eexily API",
      version: "0.1.0",
      description:
        "This is the docs for all APIs for Eexily",
    },
    servers: [
      {
        url: "https://eexily-backend.onrender.com",
      },
    ],
  },
  apis: ["./src/docs/*.ts", "./src/docs/*.js"],
};

const specs = swaggerJSDoc(options);
app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(specs, { explorer: true,
    customCssUrl:
    "https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css",
  })
);

// Create HTTP server
const httpServer = createServer(app);

// Configure Socket.IO
const io = configureSocket(httpServer);
io.on("connection", (socket: Socket) => {
  console.log(`Socket connected: ${socket.id}`);
});

// Run MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
const connection = mongoose.connection
connection.once('open', () => { console.log('Database running Successfully') });

app.use("/auth", userRouter)
app.use("/gas", gasRouter)
app.use("/notifications", notificationRouter)
app.use("/refill-schedule", refillScheduleRouter)
app.use("/gas-station", gasStationRouter)
app.use("/individual", individualRouter)
app.use("/rider", riderRouter)
app.use("/prediction", predictionRouter)
app.use("/merchant", merchantRouter)
app.use("/express-refill", expressRefillRouter)

//render the html file
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html');
// });

const gasPredictionCron = Container.get(GasPredictionCron);
gasPredictionCron.start();

app.get('/test-hardware', (req, res) => {
    res.json({message: "Test Successfull"})
});

// Run Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
