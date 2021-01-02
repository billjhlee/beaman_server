"use strict";
const bcrypt = require("bcryptjs");
const { serialize } = require("../modelHelpers/generalUtils");

const serializeOptions = {
  attributes: ["firstName", "lastName", "email"],
};

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      // firstName: {
      //   type: DataTypes.STRING
      // },
      // lastName: {
      //   type: DataTypes.STRING
      // },
      uid: {
        allowNull: true,
        unqiue: true,
        type: DataTypes.STRING,
      },
      score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      articles: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      comments: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      thumbnail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      emailverified: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("super", "editor", "general", " partner"),
        defaultValue: "general",
      },
    },
    {
      // paranoid: true,
      setterMethods: {},
      hooks: {
        beforeCreate: async (user, options) => {
          try {
            if (
              user.password !== undefined &&
              user.password !== null &&
              user.password !== ""
            )
              user.password = await bcrypt.hash(user.password, 8);
          } catch (error) {
            throw new Error("Hashing failed");
          }
        },
      },
    }
  );
  User.associate = function (models) {
    User.hasMany(models.Token, {
      foreignKey: "userId",
      sourceKey: "id",
    });
    User.hasMany(models.Article, {
      foreignKey: "userId",
      sourceKey: "id",
    });
    User.hasMany(models.Comment, {
      foreignKey: "userId",
      sourceKey: "id",
    });
    User.belongsToMany(models.Comment, {
      through: models.UserCommentLike,
      as: "comments_liked",
      targetKey: "id",
      foreignKey: "userId",
      otherKey: "commentId",
    });
    User.belongsToMany(models.Article, {
      through: models.UserArticleLike,
      as: "articles_liked",
      targetKey: "id",
      foreignKey: "userId",
      otherKey: "articleId",
    });
    User.belongsToMany(models.Article, {
      through: models.UserFavorites,
      as: "user_article_favs",
      // targetKey: "id",
      foreignKey: "userId",
      otherKey: "articleId",
    });
    User.hasMany(models.UserImage, {
      foreignKey: "userId",
      sourceKey: "id",
    });
    User.hasOne(models.CheckInStats, {
      foreignKey: "userId",
      sourceKey: "id",
    });

    User.hasMany(models.UserCheckIn, {
      foreignKey: "userId",
      sourceKey: "id",
    });
    User.belongsToMany(models.User, {
      through: models.UserFollow,
      as: "user_follows",
      targetKey: "id",
      foreignKey: "followerId",
      otherKey: "followedId",
    });
    User.belongsToMany(models.User, {
      through: models.UserFollow,
      as: "user_followed_by",
      targetKey: "id",
      foreignKey: "followedId",
      otherKey: "followerId",
    });
  };
  User.prototype.serialize = serialize(serializeOptions);
  return User;
};
