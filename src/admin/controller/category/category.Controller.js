const db = require('../../../../models');
const Category = db.Category;

module.exports = {
  // Create Category
create: async (req, res) => {
  try {
    const { name, amount } = req.body;
    const image = req.file ? req.file.filename : null;

    // Basic validation
    if (!name || !image || !amount) {
      return res.status(400).json({
        status: false,
        message: "All fields (name, image, amount) are required.",
      });
    }

    // Create the category
    const category = await Category.create({
      name,
      image,
      amount,
    });

    return res.status(201).json({
      status: true,
      message: "Category created successfully.",
      data: category,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Error creating category.",
      error: err.message,
    });
  }
}

,
update: async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount } = req.body;
    const image = req.file ? req.file.filename : undefined;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Category ID is required.",
      });
    }

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Category not found.",
      });
    }

    // Update fields
    if (name !== undefined) category.name = name;
    if (amount !== undefined) category.amount = amount;
    if (image !== undefined) category.image = image;

    await category.save();

    return res.status(200).json({
      status: true,
      message: "Category updated successfully.",
      data: category,
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Error updating category.",
      error: err.message,
    });
  }
}

,

  // Get All Categories
 list: async (req, res) => {
  try {
    const categories = await Category.findAll();

    return res.status(200).json({
      status: true,
      message: "Categories fetched successfully.",
      data: categories
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Error fetching categories.",
      error: err.message
    });
  }
}

};
