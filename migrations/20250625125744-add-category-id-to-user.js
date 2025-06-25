'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "category_id", {
      type: Sequelize.INTEGER,
      allowNull: true, // or false if required
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "category_id");
  }
};

