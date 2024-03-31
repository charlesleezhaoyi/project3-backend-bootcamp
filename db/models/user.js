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
      this.belongsToMany(models.post, { through: "likes" });
      this.hasMany(models.post);
      this.belongsToMany(models.post, { through: models.comment });
      this.hasMany(models.comment);
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
