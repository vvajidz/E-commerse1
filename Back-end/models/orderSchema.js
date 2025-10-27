const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  orders: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: Number,
      price: Number
    }
  ],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["confirmed", "pending", "shipped", "delivered"],
    default: "pending"
  },
  paymentMethod: {
    type: String,
    enum: ["cod", "razorpay"],
    required: true
  }
});

module.exports = mongoose.model("Order", orderSchema);
