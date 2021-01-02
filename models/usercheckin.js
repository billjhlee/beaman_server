"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserCheckIn = sequelize.define(
    "UserCheckIn",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Users",
          key: "username",
        },
      },
      content: {
        type: DataTypes.STRING,
      },
    },
    {
      // paranoid: true,
    }
  );
  UserCheckIn.associate = function (models) {
    UserCheckIn.belongsTo(models.User, {
      foreignKey: "userId",
      targetKey: "id",
    });
    // associations can be defined here
  };
  return UserCheckIn;
};
