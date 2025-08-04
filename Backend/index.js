import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import taskRoute from "./routes/task.route.js"
import userRoute from "./routes/user.route.js"


const app = express();
dotenv.config();

const PORT = process.env.PORT || 4002;
const DB_URI = process.env.MONGODB_URI;

//middlewares
app.use(express.json());
app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials:true,
  methods:"GET,POST,PUT,DELETE",
  allowedHeaders:["Content-Type", "Authorization"]
}))

//Database Connection Code
try {
 await mongoose.connect(DB_URI);
  console.log("Connected to MongoDB");
} catch (error) {
  console.log(error);
}

//routes
app.use("/task", taskRoute);
app.use("/user",userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
