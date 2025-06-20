'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserCategory extends Model {
    static associate(models) {
      UserCategory.belongsTo(models.User, { foreignKey: 'user_id' });
      UserCategory.belongsTo(models.Category, { foreignKey: 'category_id' });
    }
  }

  UserCategory.init({
    user_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserCategory',
    timestamps: true,
    // paranoid: true,
    // deletedAt: 'deletedAt'
  });

  return UserCategory;
};
