"use strict";
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      content: DataTypes.STRING,
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Articles",
          key: "id",
        },
      },
      likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      dislikes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Users",
          key: "username",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      parentId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Comments",
          key: "id",
        },
      },
    }
    // { paranoid: true }
  );
  Comment.associate = function (models) {
    Comment.belongsTo(models.User, {
      targetKey: "id",
      foreignKey: "userId",
    });
    Comment.belongsTo(models.Article, {
      targetKey: "id",
      foreignKey: "articleId",
    });

    Comment.hasMany(models.Comment, {
      foreignKey: "parentId",
      sourceKey: "id",
    });
    Comment.belongsTo(models.Comment, {
      targetKey: "id",
      foreignKey: "parentId",
    });
    Comment.belongsToMany(models.User, {
      through: models.UserCommentLike,
      as: "users_liked",
      otherKey: "userId",
      foreignKey: "commentId",
    });
    Comment.hasMany(models.UserCommentLike, {
      foreignKey: "commentId",
      sourceKey: "id",
    });
    // associations can be defined here
  };
  return Comment;
};
