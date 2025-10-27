const orderModel = require('../models/orderSchema');
const productModel = require('../models/productSchema');
const cartModel = require('../models/cartSchema');

// ✅ Add new order
const AddOrder = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;
    const userId = req.user?._id;

    let total = 0;

    for (const item of items) {
      const product = await productModel.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      total += product.price * item.quantity;
    }

    const newOrder = new orderModel({
      orderBy: userId,
      orders: items,
      total,
      paymentMethod,
    });

    await newOrder.save();


    // 🗑 Clear user's cart after placing order
    await cartModel.deleteMany({ cartBy: userId });

    res.status(201).json({ message: "Order placed successfully" });

  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get orders (user-specific or all if admin)
const getOrder = async (req, res) => {
  const userId = req.user?._id;
  const isAdmin = req.user?.isAdmin;

  try {
    const query = isAdmin ? {} : { orderBy: userId };

    const orders = await orderModel
      .find(query)
      .populate("orders.productId")
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({ order: orders });

  } catch (error) {
    console.error("Fetch order error:", error);
    res.status(500).json({ message: "Failed to get orders" });
  }
};

module.exports = { AddOrder, getOrder };
