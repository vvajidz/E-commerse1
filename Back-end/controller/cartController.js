const Product = require("../models/productSchema")
const Cart = require('../models/cartSchema');
const mongoose = require('mongoose')


const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ cartBy: userId });

    if (!cart) {
      cart = new Cart({
        cartBy: userId,
        items: [{
          productId: product._id,
          price: product.price,
          quantity: quantity || 1
        }]
      });
    } else {
  const existingItem = cart.items.find(item =>
    item.productId.toString() === productId.toString()
  );

  if (existingItem) {
    existingItem.quantity += quantity || 1;
    existingItem.totalprice = existingItem.quantity * product.price;
  } else {
    const qty = quantity || 1;
    cart.items.push({
      productId: product._id,
      price: product.price,
      quantity: qty,
      totalprice: product.price * qty
    });
  }
}

    await cart.save();
    res.status(200).json({ 
      message: "Item added successfully",
      cart: await Cart.findById(cart._id).populate('items.productId')
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
};


const getCart = async (req, res) => {
  const userId = req.user?._id;

  try {
    const cart = await Cart.findOne({ cartBy: userId }).populate('items.productId');
    
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "Cart is empty" });
    }
    res.status(200).json({ cart });
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const removeCart = async (req, res) => {
  const productId = req.params.id;
  const userId = req.user?._id;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!mongoose.Types.ObjectId.isValid(productId))
     return res.status(400).json({ message: "Invalid product ID" });

  try {
    const cart = await Cart.findOne({ cartBy: userId });
      if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(item => item.productId?.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

   if (item.quantity > 1) {  item.quantity -= 1;
     item.totalprice = item.quantity * item.price;
    } else {
      cart.items = cart.items.filter(i => i.productId.toString() !== productId);
    }
      await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate("items.productId");

     res.status(200).json({
      message: "Item updated or removed from cart",
      cart: updatedCart
    });

  } catch (err) {
    console.error("Remove cart error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const addANDminusCart = async (req, res) => {
  const userId = req.user?._id;
  const { productId, action } = req.body;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  try {
    const cart = await Cart.findOne({ cartBy: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(itm => itm.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found" });

if (action === "+") {item.quantity += 1;
} else if (action === "-" && item.quantity > 1) { item.quantity -= 1;
} else if (action === "-" && item.quantity === 1) {
  cart.items = cart.items.filter(itm => itm.productId.toString() !== productId);
} else {
  return res.status(400).json({ message: "Invalid action" });
}

    item.totalprice = item.price * item.quantity;

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate("items.productId");

    res.status(200).json({
      message: `Item ${action === "+" ? "ADDED" : "MINUSED"}`,
      cart: updatedCart
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};




module.exports = {getCart,removeCart,addToCart,addANDminusCart}