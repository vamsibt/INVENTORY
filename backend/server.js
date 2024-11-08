const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add CORS middleware

const app = express();

app.use(cors()); // Enable CORS for all routes

app.use(express.json());

const mongoURI ="mongodb+srv://invent:bt123456789@clusterinvent.h0sry.mongodb.net/?retryWrites=true&w=majority&appName=ClusterInvent";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const productSchema = new mongoose.Schema({
  productName: String,
  category: String,
  price: Number,
  quantity: Number,
  description: String
});

const Product = mongoose.model('Product', productSchema);

app.post('/api/product', (req, res) => {
  console.log("Request Body:", req.body);  // Log to see if data is received
  res.json({ message: "Received the product data", data: req.body });
});

app.post('/api/products', async (req, res) => {
  console.log("Request Body:", req.body);  // Log the request body for debugging
  
  const { productName, category, price, quantity, description } = req.body;
  console.log("Types of each field:");
  console.log("productName:", typeof productName);
  console.log("category:", typeof category);
  console.log("price:", typeof price);
  console.log("quantity:", typeof quantity);
  console.log("description:", typeof description);

  const newProduct = new Product({
    productName,
    category,
    price,
    quantity,
    description
  });
console.log(newProduct);
  try {
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to add product' });
  }
});


app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch products' });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
