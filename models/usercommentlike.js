"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserCommentLike = sequelize.define(
    "UserCommentLike",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      commentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Comments",
          key: "id",
        },
      },
      like: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {},
    {
      indexes: [
        {
          unique: true,
          fields: ["userId", "commentId"],
        },
      ],
    }
  );
  UserCommentLike.associate = function (models) {
    UserCommentLike.belongsTo(models.Comment, {
      foreignKey: "commentId",
      targetKey: "id",
    });
    // UserCommentLike.hasOne(models.Comment, {
    //   sourceKey: "id",
    //   foreignKey: "commentId"
    // });
    // UserCommentLike.hasOne(models.User, {
    //   sourceKey: "id",
    //   foreignKey: "userId"
    // });
  };
  return UserCommentLike;
};
