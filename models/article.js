"use strict";
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define(
    "Article",
    {
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      preview: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      dislikes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
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
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      category: {
        type: DataTypes.ENUM(
          "general",
          "health",
          "humour",
          "prove",
          "notice",
          "beerman",
          "info",
          "about"
        ),
        defaultValue: "general",
      },
    },
    {
      // paranoid: true,
    }
  );
  Article.associate = function (models) {
    Article.belongsTo(models.User, {
      foreignKey: "userId",
      targetKey: "id",
    });
    Article.hasMany(models.Comment, {
      foreignKey: "articleId",
      sourceKey: "id",
    });

    Article.belongsToMany(models.User, {
      through: models.UserFavorites,
      as: "user_favs",
      otherKey: "userId",
      foreignKey: "articleId",
    });
    Article.belongsToMany(models.User, {
      through: models.UserArticleLike,
      as: "users_liked",
      otherKey: "userId",
      foreignKey: "articleId",
    });
    // associations can be defined here
  };
  return Article;
};
