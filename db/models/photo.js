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
      this.belongsTo(models.book);
    }
  }
  photo.init(
    {
      photo_url: DataTypes.STRING,
      book_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "book",
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
