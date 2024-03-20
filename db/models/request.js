"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user, { as: "bene" });
      this.belongsTo(models.donation);
    }
  }
  request.init(
    {
      donationId: {
        type: DataTypes.INTEGER,
        referneces: {
          model: "donation",
          key: "id",
        },
      },
      beneId: {
        type: DataTypes.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
      },

      content: DataTypes.TEXT,
      status: DataTypes.ENUM([
        "pending",
        "accepted",
        "rejected",
        "cancelled",
        "collected",
      ]),
    },
    {
      sequelize,
      modelName: "request",
      underscored: true,
    }
  );
  return request;
};
