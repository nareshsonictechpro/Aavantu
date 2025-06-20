// models/faq.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FAQ extends Model {
    static associate(models) {}
  }

  FAQ.init({
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'FAQ',
    timestamps: true,
  });

  return FAQ;
};
