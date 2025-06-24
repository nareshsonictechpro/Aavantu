'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // One category has many courses
      Category.hasMany(models.Course, { foreignKey: 'category_id' });

      // One category can be purchased by many users
      Category.hasMany(models.UserCategory, { foreignKey: 'category_id' });
    }
  }

  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Category name cannot be empty" },
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Image path is required" },
      },
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: { msg: "Amount must be a valid number" },
        min: 0,
      },
    },
    purchase_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
  }, {
    sequelize,
    modelName: 'Category',
    timestamps: true,
    tableName: 'Categories', // optional: override table name if needed
  });

  return Category;
};
