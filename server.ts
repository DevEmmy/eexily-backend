import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import corsOptions from './src/config/cors';
require("dotenv").config()
import userRouter from "./src/router/UserRouter"

const app = express();
const port = String(process.env.PORT) || 3030;

// Set up your routes and middleware here
// Set up your routes and middleware here
app.use(cors({
  origin: "*"
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }))

// Run MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
const connection = mongoose.connection
connection.once('open', () => { console.log('Database running Successfully') });

app.use("/auth", userRouter)

//render the html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/test-hardware', (req, res) => {
    res.json({message: "Test Successfull"})
});

// Run Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
