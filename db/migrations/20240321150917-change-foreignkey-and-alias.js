"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.renameColumn("likes", "user_id", "liker_id");
    await queryInterface.renameColumn("likes", "post_id", "liked_post_id");
    await queryInterface.renameColumn("comments", "user_id", "commenter_id");
    await queryInterface.renameColumn(
      "comments",
      "post_id",
      "commented_post_id"
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.renameColumn("likes", "liker_id", "user_id");
    await queryInterface.renameColumn("likes", "liked_post_id", "post_id");
    await queryInterface.renameColumn("comments", "commenter_id", "user_id");
    await queryInterface.renameColumn(
      "comments",
      "commented_post_id",
      "post_id"
    );
  },
};
