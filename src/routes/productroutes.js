const express = require('express');
const router = express.Router();
const Product = require('../../app/models/product.model');

router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json(products);
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    return res.json(updatedProduct);
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    return res.json({
      message: 'Deleted successfully'
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
});

module.exports = router;
