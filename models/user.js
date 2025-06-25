'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    role: DataTypes.INTEGER,
    phone_no: DataTypes.INTEGER,
    image: DataTypes.STRING,
    is_login: DataTypes.INTEGER,
    is_verify: DataTypes.INTEGER,
    otp: DataTypes.INTEGER,
    auth_token: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    status: DataTypes.INTEGER,
    category_id: {
  type: DataTypes.INTEGER,
  allowNull: false
},
  }, {
    sequelize,
    modelName: 'User',
     paranoid: true, // Enables soft delete  // This enables soft deletion
    timestamps: true,  // Ensure timestamps (createdAt, updatedAt) are enabled
    deletedAt: 'deletedAt', // Custom name for deletedAt field (optional)
  });
  return User;
};