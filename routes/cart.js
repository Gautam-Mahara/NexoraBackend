const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

// Add item to cart
router.post('/', async (req, res) => {
  try {
    const { productId, qty } = req.body;
    console.log(productId, "add");
    
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    let cartItem = await CartItem.findOne({ product: productId });
    if (cartItem) {
      cartItem.qty += qty;
      await cartItem.save();
    } else {
      cartItem = new CartItem({ product: productId, qty });
      await cartItem.save();
    }
    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get cart + total
router.get('/', async (req, res) => {
  try {
    const items = await CartItem.find().populate('product');
    const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
    console.log(items);
    
    res.json({ items, total });
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ error: err.message });
  }
});

// Remove item
router.delete('/:id', async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Checkout (mock)
router.post('/checkout', async (req, res) => {
  try {
    const items = await CartItem.find().populate('product');
    const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);

    const receipt = {
      total,
      timestamp: new Date().toISOString(),
      items: items.map(i => ({
        name: i.product.name,
        qty: i.qty,
        price: i.product.price,
      })),
    };

    await CartItem.deleteMany(); // clear cart
    res.json({ receipt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
