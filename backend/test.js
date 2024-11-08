const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // Parses incoming JSON requests

// MongoDB URI (replace with your own MongoDB connection string)
const mongoURI = 'mongodb+srv://invent:bt123456789@cluster0.h0sry.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("Error connecting to MongoDB:", err));

// Define Product Schema
const productSchema = new mongoose.Schema({
  productName: String,
  category: String,
  price: Number,
  quantity: Number,
  description: String
});

// Create Product model
const Product = mongoose.model('Product', productSchema);

// POST route to add a new product
app.post('/api/products', async (req, res) => {
  console.log("Request Body:", req.body);  // Log request body for debugging

  // Destructure request body to get product details
  const { productName, category, price, quantity, description } = req.body;
  
  console.log("Types of each field:");
  console.log("productName:", typeof productName);
  console.log("category:", typeof category);
  console.log("price:", typeof price);
  console.log("quantity:", typeof quantity);
  console.log("description:", typeof description);

  // Create a new product instance
  const newProduct = new Product({
    productName,
    category,
    price,
    quantity,
    description
  });

  try {
    await newProduct.save();  // Save the product to the database
    console.log("Product saved:", newProduct);  // Log the saved product
    res.status(201).json({ message: 'Product added successfully', data: newProduct });
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(400).json({ error: 'Failed to add product' });
  }
});

// GET route to retrieve all products
app.get('/api/productsget', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch products' });
  }
});

// PUT route to update an existing product
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { productName, category, price, quantity, description } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { productName, category, price, quantity, description },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', data: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(400).json({ error: 'Failed to update product' });
  }
});
// GET route to fetch a single product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: 'Failed to fetch product' });
    }
});

// DELETE route to delete a product
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully', data: deletedProduct });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(400).json({ error: 'Failed to delete product' });
  }
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
