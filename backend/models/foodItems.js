const mongoose = require('mongoose')


// Define the FoodItem schema
const foodItemSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  }, {
    timestamps: true
  });
  
  // Create the FoodItem model
  const FoodItem = mongoose.model('FoodItem', foodItemSchema);

  module.exports = FoodItem;