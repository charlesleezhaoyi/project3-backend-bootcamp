"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.post, {
        as: "commentedPost",
        foreignKey: "commentedPostId",
      });
      this.belongsTo(models.user, {
        as: "commenter",
        foreignKey: "commenterId",
      });
    }
  }
  comment.init(
    {
      commentedPostId: {
        type: DataTypes.INTEGER,
        references: { model: "posts", key: "id" },
      },
      commenterId: {
        type: DataTypes.INTEGER,
        references: { model: "users", key: "id" },
      },
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "comment",
      underscored: true,
    }
  );
  return comment;
};
