'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Course, { foreignKey: 'category_id' });
      Category.hasMany(models.UserCategory, { foreignKey: 'category_id' });
    }
  }

  Category.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    purchase_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Category',
    timestamps: true,
 
 });

  return Category;
};
