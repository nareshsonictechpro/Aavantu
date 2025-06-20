'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.INTEGER(1),
        defaultValue: 1,
        comment: "1 =>Admin"
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone_no: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      is_login: {
        type: Sequelize.INTEGER(1),
        defaultValue: 0,
        comment: "1 =>login 0 => logout"
      },
      is_verify: {
        type: Sequelize.INTEGER(1),
        defaultValue: 0,
        comment: "1 =>verify 0 => not verify"
      },
      otp: {
        type: Sequelize.INTEGER(6),
        allowNull: true
      },
      auth_token: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.INTEGER(1),
        defaultValue: 0,
        comment: "1 =>active 0 => inactive"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};