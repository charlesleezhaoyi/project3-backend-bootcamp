"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("categories", [
      {
        id: "1",
        name: "Horror",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "2",
        name: "Sci-Fi",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "3",
        name: "Thriller",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "4",
        name: "Romance",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "5",
        name: "Adventure",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "6",
        name: "History",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "7",
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
