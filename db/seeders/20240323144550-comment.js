"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("comments", [
      {
        commented_post_id: 7,
        commenter_id: 2,
        content:
          'I read "The Great Gatsby" last year, and I absolutely loved it. The way Fitzgerald captures the essence of the Jazz Age is remarkable.',
        created_at: new Date("2024-01-07T03:21:00"),
        updated_at: new Date("2024-01-07T03:21:00"),
      },
      {
        commented_post_id: 5,
        commenter_id: 2,
        content: "Hello World!",
        created_at: new Date("2024-01-08T03:21:00"),
        updated_at: new Date("2024-01-08T03:21:00"),
      },
      {
        commented_post_id: 7,
        commenter_id: 1,
        content:
          'I completely agree! "The Great Gatsby" is a beautifully written novel with captivating characters and a thought-provoking storyline.',
        created_at: new Date("2024-02-10T09:00:00"),
        updated_at: new Date("2024-02-10T09:00:00"),
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
