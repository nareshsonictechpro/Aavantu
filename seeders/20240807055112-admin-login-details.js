'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('123456', 10); // Replace 'admin_password' with your desired password

    await queryInterface.bulkInsert('Users', [{
      first_name: 'Naresh',
      last_name: 'Kumhar',
      email: 'Naresh1@yopmail.com',
      password: hashedPassword,
      role: 1,
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {});
  }
};
