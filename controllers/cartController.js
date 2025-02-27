import CartItem from '../models/cartModels.js';


// Controller for adding an item to the cart
export async function addToCart(req, res) {
    try {
        const { nic, foodId, quantity } = req.body;

        if (!nic || !foodId || !quantity) {
            return res.status(400).json({ error: "All fields are required" });
        }

        let cartItem = await CartItem.findOne({ nic });

        if (!cartItem) {
            cartItem = new CartItem({
                nic,
                foodItems: [{ foodId, quantity }]
            });
        } else {
            const existingFoodItem = cartItem.foodItems.find(item => item.foodId.equals(foodId));
            if (existingFoodItem) {
                existingFoodItem.quantity += quantity;
            } else {
                cartItem.foodItems.push({ foodId, quantity });
            }
        }

        const savedCartItem = await cartItem.save();

        res.status(201).json({
            message: "Item added to cart successfully",
            cartItemId: savedCartItem._id,
            data: savedCartItem
        });
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ error: "An error occurred while adding item to cart" });
    }
}

// Controller for calculating total price
export async function calculateTotalPrice(req, res) {
    try {
        const { cartItemId } = req.params;
        const cartItem = await CartItem.findById(cartItemId).populate('foodItems.foodId');

        if (!cartItem) {
            return res.status(404).json({ error: "Cart item not found" });
        }

        let totalPrice = cartItem.foodItems.reduce((sum, item) => sum + (item.foodId.price * item.quantity), 0);

        res.status(200).json({ total_price: totalPrice });
    } catch (error) {
        console.error("Error calculating total price:", error);
        res.status(500).json({ error: "An error occurred while calculating total price" });
    }
}

// Controller for removing an item from the cart
export async function removeFromCart(req, res) {
    try {
        const { nic, foodId } = req.params;

        if (!nic || !foodId) {
            return res.status(400).json({ error: "NIC and Food ID are required" });
        }

        let cartItem = await CartItem.findOne({ nic });

        if (!cartItem) {
            return res.status(404).json({ error: "Cart not found" });
        }

        cartItem.foodItems = cartItem.foodItems.filter(item => !item.foodId.equals(foodId));

        const updatedCartItem = await cartItem.save();

        res.status(200).json({
            message: "Item removed from cart successfully",
            data: updatedCartItem
        });
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ error: "An error occurred while removing item from cart" });
    }
}

// Controller for fetching cart items by NIC and cartItemId
export async function getCartItemsByNIC(req, res) {
    try {
        const { nic, cartItemId } = req.params;
        const cartItem = await CartItem.findOne({ nic, _id: cartItemId }).populate('foodItems.foodId', 'foodname price imageUrl');

        if (!cartItem) {
            return res.status(404).json({ error: "Cart not found" });
        }

        res.status(200).json({ data: cartItem.foodItems });
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({ error: "An error occurred while fetching cart items" });
    }
}

// Controller for deleting a cart by NIC and cartItemId
export async function deleteCartByNICAndCartItemId(req, res) {
    try {
        const { nic, cartItemId } = req.params;
        const cartItem = await CartItem.findOneAndDelete({ nic, _id: cartItemId });

        if (!cartItem) {
            return res.status(404).json({ error: "Cart not found" });
        }

        res.status(200).json({ message: "Cart deleted successfully" });
    } catch (error) {
        console.error("Error deleting cart:", error);
        res.status(500).json({ error: "An error occurred while deleting cart" });
    }
}
