const db = require('../../../../models');
const Category = db.Category;

module.exports = {
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
