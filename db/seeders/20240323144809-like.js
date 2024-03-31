"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("likes", [
      {
        liked_post_id: 2,
        liker_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        liked_post_id: 2,
        liker_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        liked_post_id: 3,
        liker_id: 2,
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
    await queryInterface.bulkDelete("likes", null, {});
  },
};
