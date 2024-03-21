"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.category, { through: "user_categories" });
      this.hasMany(models.request);
      this.hasMany(models.donation);
      this.belongsToMany(models.book, {
        as: "donor",
        through: "donation",
        foreignKey: "donorId",
      });
      this.belongsToMany(models.book, {
        as: "bene",
        through: "donation",
        foreignKey: "beneId",
      });
      this.belongsToMany(models.donation, {
        through: "request",
        foreignKey: "beneId",
      });
      this.belongsToMany(models.post, {
        as: "commentedPost",
        through: models.comment,
        foreignKey: "commenterId",
        otherKey: "commentedPostId",
      });
      this.hasMany(models.comment, {
        as: "commenter",
        foreignKey: "commenterId",
      });
      this.belongsToMany(models.post, {
        through: models.like,
        as: "likedPost",
        foreignKey: "likerId",
        otherKey: "likedPostId",
      });
      this.hasMany(models.like, { as: "liker", foreignKey: "likerId" });
      this.hasMany(models.post, { as: "author", foreignKey: "authorId" });
    }
  }
  user.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user",
      underscored: true,
    }
  );
  return user;
};
