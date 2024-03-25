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
    await queryInterface.bulkInsert("posts", [
      {
        title: "Hello",
        content: "Hello",
        author_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "World",
        content: "World",
        author_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "Hello World",
        content: "Hello World",
        author_id: 1,
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
    await queryInterface.bulkDelete("posts", null, {});
  },
};
