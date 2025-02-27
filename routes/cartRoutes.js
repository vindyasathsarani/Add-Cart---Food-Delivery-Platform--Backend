import express from "express";
import { addToCart, calculateTotalPrice, deleteCartByNICAndCartItemId, getCartItemsByNIC, removeFromCart } from "../controllers/cartController.js";
const cartRouter = express.Router();


// Route for adding an item to the cart
cartRouter.post("/addItem/:nic/:foodId", addToCart);
cartRouter.get("/totalPrice/:nic/:cartItemId", calculateTotalPrice);
cartRouter.delete("/removeItem/:nic/:foodId", removeFromCart); // Updated to use DELETE method with URL parameters
// Route to fetch cart items by NIC
cartRouter.get("/cartItems/:nic/:cartItemId", getCartItemsByNIC);
cartRouter.delete("/cartItems/:nic/:cartItemId", deleteCartByNICAndCartItemId);



export default cartRouter;