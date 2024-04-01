"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("category_posts", [
      {
        post_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        post_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        post_id: 1,
        category_id: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        post_id: 2,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        post_id: 2,
        category_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        post_id: 2,
        category_id: 6,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        post_id: 3,
        category_id: 28,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        post_id: 3,
        category_id: 27,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("category_posts", null, {});
  },
};
