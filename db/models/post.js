"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user, { as: "author", foreignKey: "authorId" });
      this.belongsToMany(models.user, { through: models.comment });
      this.hasMany(models.comment);
      this.belongsToMany(models.user, { through: models.like });
      this.hasMany(models.like);
      this.belongsToMany(models.category, { through: "category_posts" });
    }
  }
  post.init(
    {
      title: DataTypes.STRING,
      authorId: {
        type: DataTypes.INTEGER,
        references: { model: "users", key: "id" },
      },
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "post",
      underscored: true,
    }
  );
  return post;
};
