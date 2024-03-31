"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("categories", [
      {
        name: "Horror",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Sci-Fi",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Thriller",
        created_at: new Date(),
        updated_at: new Date(),
      },
      { name: "Romance", created_at: new Date(), updated_at: new Date() },
      { name: "Adventure", created_at: new Date(), updated_at: new Date() },
      {
        name: "History",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Biography",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("categories", null, {});
  },
};
