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
        title: "Introduction to the Forum",
        content:
          "Welcome to our forum! This is a place to introduce yourself and get to know other members of the community.",
        author_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "Favorite Books",
        content:
          "Share your favorite books and recommendations with fellow book lovers. What are you currently reading?",
        author_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Book Recommendation: "The Great Gatsby"',
        content:
          "Let's discuss Harper Lee's \"To Kill a Mockingbird\". Share your thoughts on the characters, themes, and moral lessons depicted in the novel.",
        author_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Discussion: "To Kill a Mockingbird"',
        content:
          "Let's discuss Harper Lee's \"To Kill a Mockingbird\". Share your thoughts on the characters, themes, and moral lessons depicted in the novel.",
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
