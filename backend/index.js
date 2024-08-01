const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const FoodItem = require("./models/foodItems");
require('dotenv').config()

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI,
    {}
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

// GET all food items
app.get("/api/food-items", async (req, res) => {
  try {
    const foodItems = await FoodItem.find({});
    res.status(200).json({foodItems });
  } catch (error) {
    console.log("Error in fetching products", error.message);
    res.status(500).json({ success: false, data: "Server Error" });
  }
});

// POST a new food item
app.post("/api/food-items", async (req, res) => {
  const foodItem = req.body;

  if (!foodItem.name || !foodItem.price) {
    return res.status(400).json({ message: "Please provide name and price" });
  }
  const newFoodItem = new FoodItem(foodItem);
  try {
    await newFoodItem.save();
    res.status(201).json({ success: true, data: newFoodItem });
  } catch (error) {
    console.log("Error in create food item", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// PUT (update) a food item
app.put("/api/food-items/:id", async (req, res) => {
  const { id } = req.params;

  const foodItem = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  try {
    const updatedFoodItem = await FoodItem.findByIdAndUpdate(id, foodItem, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedFoodItem });
  } catch (error) {
    console.log("Error in update food item", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});



// DELETE a food item
app.delete("/api/food-items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await FoodItem.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Food item deleted" });
  } catch (error) {
    res.status(404).json({ success: false, message: "Food item not found" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
