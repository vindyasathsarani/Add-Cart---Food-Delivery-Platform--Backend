import express from "express";
import { addFood, getAllFoods } from "../controllers/foodController.js";
const foodRouter = express.Router();

// Middleware to parse JSON data
foodRouter.use(express.json());

// Routes
foodRouter.post("/add", addFood);
foodRouter.get("/fetch", getAllFoods);

export default foodRouter;
