"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user);
      this.belongsTo(models.post);
    }
  }
  like.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "users", key: "id" },
      },
      postId: {
        type: DataTypes.INTEGER,
        references: { model: "posts", key: "id" },
      },
    },
    {
      sequelize,
      modelName: "like",
      underscored: true,
    }
  );
  return like;
};
