"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("categories", [
      {
        name: "Fiction",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Non-Fiction",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Science Fiction",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Fantasy",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Mystery",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Romance",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Horror",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Biography",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "History",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Self-Help",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Others",
        created_at: new Date(),
        updated_at: new Date(),
      },
      { name: "Adventure", created_at: new Date(), updated_at: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("categories", null, {});
  },
};
