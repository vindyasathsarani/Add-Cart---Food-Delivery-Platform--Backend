import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cartRouter from "./routes/cartRoutes.js";
import customerRouter from "./routes/customerRoutes.js";

dotenv.config();

const app = express();

app.use(bodyParser.json());

const connectionString = process.env.MONGO_URL;

app.use((req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (token != null) {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (decoded != null) {
        req.user = decoded;
        next();
      } else {
        next();
      }
    });
  } else {
    next();
  }
});

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch(() => {
    console.log("connection failed");
  });

app.use("/api/addCart", cartRouter);
app.use("/api/customer", customerRouter);

app.listen(4000, (req, res) => {
  console.log("Server is running on port 5000");
});
