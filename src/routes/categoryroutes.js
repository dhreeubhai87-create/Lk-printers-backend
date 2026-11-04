const express = require('express');
const router = express.Router();
const Category = require('../../app/models/category.model');

router.post('/', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    return res.status(201).json(category);
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(400).json({
        message: 'Category already exists'
      });
    }

    return res.status(500).json({
      message: err.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res.json(categories);
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        message: 'Category not found'
      });
    }

    return res.json(updatedCategory);
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res.status(404).json({
        message: 'Category not found'
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
