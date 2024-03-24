"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "categories",
      [
        {
          name: "Fiction",
          created_at: new Date(),
          updated_at: new Date(),
        },
        { name: "Non-Fiction", created_at: new Date(), updated_at: new Date() },
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
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(`categories`, null, {});
  },
};
