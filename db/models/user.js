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
      this.hasMany(models.request, { foreignKey: "beneId" });

      this.belongsToMany(models.donation, {
        through: models.request,
        as: "requesterDonation",
        foreignKey: "beneId",
        otherKey: "donationId",
      });
      this.hasMany(models.donation, { as: "donor", foreignKey: "donorId" });
      this.hasMany(models.donation, { as: "bene", foreignKey: "beneId" });
      this.belongsToMany(models.post, {
        as: "commentedPosts",
        through: models.comment,
        foreignKey: "commenterId",
        otherKey: "commentedPostId",
      });
      this.hasMany(models.comment, { foreignKey: "commenterId" });
      this.belongsToMany(models.post, {
        through: models.like,
        as: "likedPosts",
        foreignKey: "likerId",
        otherKey: "likedPostId",
      });
      this.hasMany(models.like, { foreignKey: "likerId" });
      this.hasMany(models.post, { as: "author", foreignKey: "authorId" });
    }
  }
  user.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user",
      underscored: true,
    }
  );
  return user;
};
