"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserFollow = sequelize.define(
    "UserFollow",
    {
      followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      followedId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
    },
    {}
  );
  UserFollow.associate = function (models) {
    UserFollow.belongsTo(models.User, {
      as: "user_follows",
      foreignKey: "followerId",
      targetKey: "id",
    });
    UserFollow.belongsTo(models.User, {
      as: "user_followed_by",
      foreignKey: "followedId",
      targetKey: "id",
    });
    // associations can be defined here
  };
  return UserFollow;
};
