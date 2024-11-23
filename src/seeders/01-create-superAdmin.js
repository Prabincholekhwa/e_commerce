const bcrypt = require('bcrypt');
('use strict');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'admins',
      [
        {
          full_name: 'Super Admin',
          id: '6c9904794f56e51e',
          email: 'contact.codexcholex@gmail.com',
          password: await bcrypt.hash('Super@123', 10),
          role: 'super-admin',
          inserted: new Date(),
          updated: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('admins', null, {});
  },
};
