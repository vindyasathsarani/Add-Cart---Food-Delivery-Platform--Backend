import Food from "../models/foodModels.js";


// Controller for adding food
export const addFood = async (req, res) => {
  try {
    const { foodname, price, description, imageUrl } = req.body;

    if (!foodname || !price || !description || !imageUrl) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newFood = new Food({
      foodname,
      price,
      description,
      imageUrl
    });

    const savedFood = await newFood.save();

    res.status(200).json({ 
      message: "Food added successfully", 
      data: savedFood
    });
  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({ error: "An error occurred while adding food" });
  }
};


// Controller for fetching all foods
export const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    console.error("Error fetching foods:", error);
    res.status(500).json({ error: "An error occurred while fetching foods" });
  }
};
