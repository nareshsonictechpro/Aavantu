const db = require('../../../../models');
const Category = db.Category;

module.exports = {
  // Create Category
  create: async (req, res) => {
    try {
      const { name, image, amount } = req.body;
      const category = await Category.create({
        name,
        image,
        amount,
        purchase_count: 0
      });
      res.status(201).json({ message: "Category created", category });
    } catch (err) {
      res.status(500).json({ message: "Error creating category", error: err.message });
    }
  },

  // Get All Categories
  list: async (req, res) => {
    try {
      const categories = await Category.findAll();
      res.json({ categories });
    } catch (err) {
      res.status(500).json({ message: "Error fetching categories", error: err.message });
    }
  }
};
