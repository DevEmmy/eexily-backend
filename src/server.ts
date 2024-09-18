import express from 'express'
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


const app = express();
const port = String(process.env.PORT) || 3030;

// Set up your routes and middleware here
// Set up your routes and middleware here
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
  apis: ["./docs/*.ts"],
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

//render the html file
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html');
// });

app.get('/test-hardware', (req, res) => {
    res.json({message: "Test Successfull"})
});

// Run Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
