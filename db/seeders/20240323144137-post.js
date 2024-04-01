const db = require("../models/index");

("use strict");

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
     *
     */
    const John = await db.user.findOne({
      where: { email: "example@example.com" },
    });
    const Ian = await db.user.findOne({
      where: { email: "example@IanLau.com" },
    });
    await queryInterface.bulkInsert("posts", [
      {
        title: "Introduction to the Forum",
        content:
          "Welcome to our forum! This is a place to introduce yourself and get to know other members of the community.",
        author_id: John.id,
        created_at: new Date("2024-01-01T03:23:00"),
        updated_at: new Date("2024-01-01T03:23:00"),
      },
      {
        title: "Favorite Books",
        content:
          "Share your favorite books and recommendations with fellow book lovers. What are you currently reading?",
        author_id: Ian.id,
        created_at: new Date("2024-01-02T04:23:00"),
        updated_at: new Date("2024-01-02T04:23:00"),
      },
      {
        title: 'Book Recommendation: "The Great Gatsby"',
        content:
          "Let's discuss Harper Lee's \"To Kill a Mockingbird\". Share your thoughts on the characters, themes, and moral lessons depicted in the novel.",
        author_id: John.id,
        created_at: new Date("2024-01-05T03:21:00"),
        updated_at: new Date("2024-01-05T03:21:00"),
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
