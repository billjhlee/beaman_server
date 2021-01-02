"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserFavorites = sequelize.define(
    "UserFavorites",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Articles",
          key: "id",
        },
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["userId", "articleId"],
        },
      ],
    }
  );
  UserFavorites.associate = function (models) {
    // associations can be defined here
  };
  return UserFavorites;
};
