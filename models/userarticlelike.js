"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserArticleLike = sequelize.define(
    "UserArticleLike",
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
      like: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {}
  );
  UserArticleLike.associate = function (models) {
    UserArticleLike.belongsTo(models.Article, {
      foreignKey: "articleId",
      targetKey: "id",
    });
    // associations can be defined here
  };
  return UserArticleLike;
};
