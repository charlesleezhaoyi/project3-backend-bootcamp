"use strict";

const db = require("../models/index");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const postOne = await db.post.findOne({
      where: { title: "Introduction to the Forum" },
    });
    const postTwo = await db.post.findOne({
      where: { title: "Favorite Books" },
    });
    const postThree = await db.post.findOne({
      where: { title: 'Book Recommendation: "The Great Gatsby"' },
    });
    const Fiction = await db.category.findOne({
      where: { name: "Fiction" },
    });
    const NonFiction = await db.category.findOne({
      name: "Non-Fiction",
    });
    const SciFiction = await db.category.findOne({
      where: { name: "Science Fiction" },
    });
    const Fantasy = await db.category.findOne({
      where: { name: "Fantasy" },
    });
    const Mystery = await db.category.findOne({
      where: { name: "Mystery" },
    });
    const Romance = await db.category.findOne({
      where: { name: "Romance" },
    });

    await queryInterface.bulkInsert("category_posts", [
      {
        post_id: postOne.id,
        category_id: Fiction.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        post_id: postOne.id,
        category_id: NonFiction.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        post_id: postOne.id,
        category_id: Mystery.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        post_id: postTwo.id,
        category_id: Fiction.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        post_id: postTwo.id,
        category_id: SciFiction.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        post_id: postTwo.id,
        category_id: Romance.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        post_id: postThree.id,
        category_id: NonFiction.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        post_id: postThree.id,
        category_id: Fantasy.id,
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
