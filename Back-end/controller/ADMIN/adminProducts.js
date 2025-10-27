const Products = require('../../models/productSchema');
const cloudinary = require('../../utils/cloudinary');

// Get all products
const getAllproducts = async (req, res) => {
  try {
    const product = await Products.find();
    return res.status(200).json({ product });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product });
  } catch {
    console.error('Error on fetching product by id');
    res.status(500).json({ message: "Server error" });
  }
};

// Get products by category
const getProductByCategory = async (req, res) => {
  const categoryName = req.params.categoryName;
  try {
    const products = await Products.find({ category: categoryName });
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No product found in this category" });
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add product with Cloudinary upload
const addProduct = async (req, res) => {
  try {
    const { name, brand, description, price, category } = req.body;
    const imageFiles = req.files;

    const existingProduct = await Products.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists" });
    }

    if (!imageFiles || imageFiles.length === 0) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const imageUrls = [];

    for (const file of imageFiles) {
      const base64Data = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

      const uploadResponse = await cloudinary.uploader.upload(base64Data, {
        folder: 'products',
      });

      imageUrls.push(uploadResponse.secure_url);
    }

    const newProduct = new Products({
      name,
      brand,
      description,
      price,
      category,
      image: imageUrls,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });

  } catch (err) {
    console.error("Error adding product", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update product with new Cloudinary images
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const updateFields = {
      name: req.body.name,
      brand: req.body.brand,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      isActive: req.body.isActive
    };

    if (req.files && req.files.length > 0) {
      const imageUrls = [];

      for (const file of req.files) {
        const base64Data = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const uploadResponse = await cloudinary.uploader.upload(base64Data, {
          folder: 'products',
        });
        imageUrls.push(uploadResponse.secure_url);
      }

      updateFields.image = imageUrls;
    }

    const updatedProduct = await Products.findByIdAndUpdate(productId, updateFields, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });

  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message:error });
  }
};

// Deactivate or activate product
const deactivateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Products.findById(productId);
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.status(200).json({
      message: `Product has been ${product.isActive ? 'activated' : 'deactivated'} successfully`
    });

  } catch (error) {
    console.error('Error toggling product active state:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {getAllproducts,getProductById,getProductByCategory,addProduct,updateProduct,deactivateProduct};
