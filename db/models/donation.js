"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class donation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user, { as: "bene", foreignKey: "beneId" });
      this.belongsTo(models.user, { as: "donor", foreignKey: "donorId" });
      this.hasMany(models.request);
      this.belongsToMany(models.user, { through: "request" });
      this.belongsTo(models.book);
    }
  }
  donation.init(
    {
      donorId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      bookId: {
        type: DataTypes.INTEGER,
        references: {
          model: "books",
          key: "id",
        },
      },
      beneId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "donation",
      underscored: true,
    }
  );
  return donation;
};
