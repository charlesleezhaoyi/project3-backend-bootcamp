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
      this.belongsTo(models.user, { as: "liker", foreignKey: "likerId" });
      this.belongsTo(models.post, {
        as: "likedPost",
        foreignKey: "likedPostId",
      });
    }
  }
  like.init(
    {
      likerId: {
        type: DataTypes.INTEGER,
        references: { model: "users", key: "id" },
      },
      likedPostId: {
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
