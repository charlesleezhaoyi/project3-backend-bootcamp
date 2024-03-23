"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("comments", [
      {
        commented_post_id: 3,
        commenter_id: 2,
        content: "Hello",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        commented_post_id: 1,
        commenter_id: 2,
        content: "World",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        commented_post_id: 3,
        commenter_id: 1,
        content: "Hello World",
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
    await queryInterface.bulkDelete("comments", null, {});
  },
};
