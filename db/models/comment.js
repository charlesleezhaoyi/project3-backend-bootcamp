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
      this.belongsTo(models.post, { as: "post", foreignKey: "postId" });
      this.belongsTo(models.user, { as: "user", foreignKey: "userId" });
    }
  }
  comment.init(
    {
      postId: {
        type: DataTypes.INTEGER,
        references: { model: "posts", key: "id" },
      },
      userId: {
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
