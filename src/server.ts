import express, { Application, Request, Response } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import corsOptions from './config/cors';
require("dotenv").config()
import userRouter from "./router/UserRouter"
import gasRouter from "./router/gasRoutes"
import notificationRouter from "./router/notificationRouter"
import refillScheduleRouter from "./router/rsRouter"
import individualRouter from "./router/individualRouter"
import riderRouter from "./router/riderRoute"
import gasStationRouter from "./router/GasStationRouter"
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from "swagger-ui-express"
import predictionRouter from "./router/gasPredictionRouter"
import { requestLogger } from './requestLogger';
import fs from 'fs';
import path from 'path';
import merchantRouter from "./router/merchantRoutes"
import expressRefillRouter from "./router/expressRefillRouter"
import { createServer } from "http";
import { Socket } from 'socket.io';
import GasPredictionCron from './services/GasPredictionCron';
import Container from 'typedi';
import ExpressRefill from './models/expressRefill';
import { RefillStatus } from './enum/refillStatus';
import crypto from "crypto";
import NotificationService from './services/NotificationServices';
import { INotification } from './models/notification';
import SocketServices from './services/SocketServices';
import { initSocket } from './config/socket';

const app = express();
const port = process.env.PORT || 10000;

app.use(requestLogger);

// Route to serve logs as HTML
app.get('/logs', (req: Request, res: Response) => {
  const logFilePath = path.join(__dirname, 'logs.txt');

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
  swaggerUI.setup(specs, {
    explorer: true,
    customCssUrl:
      "https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css",
  })
);

// Create HTTP server
const httpServer = createServer(app);

// Configure Socket.IO
initSocket(httpServer); // Initialize Socket.IO with the server

// Initialize SocketServices after Socket.IO
const socketServices = Container.get(SocketServices)
socketServices.initialize();

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
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const notificationService = Container.get(NotificationService)

app.post("/verify", async (req: Request, res: Response) => {
  try {
    // Paystack secret key
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY || "sk_test_de08c04eb8b47c95d24fc8383fdcae573dbdb996";

    // Verify the webhook signature
    const hash = crypto
      .createHmac("sha512", paystackSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    const paystackSignature = req.headers["x-paystack-signature"];
    if (hash !== paystackSignature) {
      return res.status(401).send("Unauthorized request.");
    }

    const event = req.body.event;
    console.log(event)
    console.log(req.body);

    if (event === "charge.success") {
      // Extract data from Paystack webhook payload
      const { reference, metadata } = req.body.data;

      // Ensure metadata contains your custom fields like refillId
      const { refillId, userId } = metadata
      if (!refillId) {
        return res.status(400).json({ message: "Missing refillId in metadata." });
      }

      // Update the refill status in the database
      const updatedRefill = await ExpressRefill.findOneAndUpdate(
        { _id: refillId },
        { status: RefillStatus.PAID },
        { new: true }
      )

      if (!updatedRefill) {
        return res.status(404).json({ message: "Refill record not found." });
      }

      console.log(`Payment successful for refill: ${refillId}`);

      let notification: Partial<INotification> = {
        userId: new mongoose.Types.ObjectId(userId),
        actionLabel: "Order Status",
        message: "Payment Confirmed",
        notificationType: "PAID"
      }

      let riderNotification: Partial<INotification> = {
        message: "You have a paid order waiting for pick up! Check your incoming orders.",
        actionLabel: "Order Status",
        notificationType: "PAID",
        userId: new mongoose.Types.ObjectId(updatedRefill.rider)
    }

    let merchantNotification: Partial<INotification> = {
      message: "You have a paid order, the rider will come and drop the cylinder soon! Check your incoming orders.",
      actionLabel: "Order Status",
      notificationType: "PAID",
      userId: new mongoose.Types.ObjectId(updatedRefill.merchant)
  }

      notificationService.sendNotification(merchantNotification)
      notificationService.sendNotification(riderNotification)
      notificationService.sendNotification(notification)

      // Send success response to Paystack
      return res.status(200).send("Payment processed successfully.");
    }

    // For other events, you can log or handle them as needed
    console.log(`Unhandled event: ${event}`);
    res.status(200).send("Event received.");
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).send("Internal server error.");
  }
});

const gasPredictionCron = Container.get(GasPredictionCron);
gasPredictionCron.start();

app.get('/test-hardware', (req, res) => {
  res.json({ message: "Test Successfull" })
});

app.get("/test-socket", (req, res) => {
  let notification: any = {
    userId: "67427b3396f896b073a1d802",
    actionLabel: "Order Status",
    message: "Payment Confirmed",
    notificationType: "PAID"
  }

  notificationService.sendNotification(notification)
  return res.json({message: "sent"})
})




// Run Server
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
