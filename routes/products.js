const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Fetch all products (and seed if empty)
router.get('/', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany([
  {
    name: 'Vibe T-Shirt',
    price: 299,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Vibe Hoodie',
    price: 799,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3aafd?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Vibe Cap',
    price: 199,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Wireless Earbuds',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1583225154324-86e9e5e6c8c0?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Phone Stand',
    price: 399,
    image: 'https://images.unsplash.com/photo-1591209627710-86dcf62d9c4f?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Smartwatch',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1512445239397-8893f1b4814b?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Bluetooth Speaker',
    price: 1799,
    image: 'https://images.unsplash.com/photo-1614314103074-94e876d8e2e5?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Laptop Sleeve',
    price: 499,
    image: 'https://images.unsplash.com/photo-1618387091631-fbe7c2270b2a?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Wireless Mouse',
    price: 349,
    image: 'https://images.unsplash.com/photo-1587202372775-98927f4a3bfc?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Gaming Keyboard',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=800&q=80'
  }
]
);
    }

    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Live Search route
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || "";
    console.log("Search query:", q);

    const results = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    });
    res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
