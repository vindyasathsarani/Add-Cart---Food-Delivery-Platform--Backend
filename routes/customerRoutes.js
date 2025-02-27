import express from "express";
import {
  fetchCustomers,
  loginCustomer,
  registerCustomer,
} from "../controllers/customerController.js";
const customerRouter = express.Router();

customerRouter.post("/register", registerCustomer);
customerRouter.get("/fetchc", fetchCustomers);
customerRouter.post("/loginCus", loginCustomer);

export default customerRouter;
