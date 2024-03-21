"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.book, { as: "book", foreignKey: "bookId" });
    }
  }
  photo.init(
    {
      photo_url: DataTypes.STRING,
      bookId: {
        type: DataTypes.INTEGER,
        references: {
          model: "books",
          key: "id",
        },
      },
      index: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "photo",
      underscored: true,
    }
  );
  return photo;
};
