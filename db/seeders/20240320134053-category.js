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
          name: "science fiction",
          created_at: new Date(),
          updated_at: new Date(),
        },
        { name: "horror", created_at: new Date(), updated_at: new Date() },
        { name: "romance", created_at: new Date(), updated_at: new Date() },
        { name: "adventure", created_at: new Date(), updated_at: new Date() },
        {
          name: "history",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "biography",
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
