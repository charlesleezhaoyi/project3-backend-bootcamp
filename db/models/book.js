"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.photo);
      this.hasMany(models.donation);
    }
  }
  book.init(
    {
      title: DataTypes.STRING,
      author: DataTypes.STRING,
      description: DataTypes.TEXT,
      released_year: DataTypes.INTEGER,
      condition: DataTypes.STRING,
      review: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "book",
      underscored: true,
    }
  );
  return book;
};
