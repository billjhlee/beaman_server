"use strict";
module.exports = (sequelize, DataTypes) => {
  const CheckInStats = sequelize.define(
    "CheckInStats",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      total: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      first: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      consecutive: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      // paranoid: true,
    }
  );
  CheckInStats.associate = function (models) {
    CheckInStats.belongsTo(models.User, {
      foreignKey: "userId",
      targetKey: "id",
    });
    // associations can be defined here
  };
  return CheckInStats;
};
