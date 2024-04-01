"use strict";

const db = require("../models/index");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const John = await db.user.findOne({
      where: { email: "example@example.com" },
    });
    const Ian = await db.user.findOne({
      where: { email: "example@IanLau.com" },
    });
    const postTwo = await db.post.findOne({
      where: { title: "Favorite Books" },
    });
    const postThree = await db.post.findOne({
      where: { title: 'Book Recommendation: "The Great Gatsby"' },
    });

    await queryInterface.bulkInsert("likes", [
      {
        liked_post_id: postTwo.id,
        liker_id: Ian.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        liked_post_id: postTwo.id,
        liker_id: John.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        liked_post_id: postThree.id,
        liker_id: Ian.id,
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
