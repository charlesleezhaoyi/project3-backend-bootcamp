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
      this.belongsToMany(models.category, { through: "category_books" });
      this.hasMany(models.photo, { onDelete: "CASCADE" });
      this.belongsTo(models.donation);
    }
  }
  book.init(
    {
      title: DataTypes.STRING,
      author: DataTypes.STRING,
      description: DataTypes.TEXT,
      releasedYear: DataTypes.INTEGER,
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
