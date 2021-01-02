"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "UserCommentLikes",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: {
              tableName: "Users",
            },
            key: "id",
          },
          allowNull: false,
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        commentId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: {
              tableName: "Comments",
            },
            key: "id",
          },
          allowNull: false,
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        like: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {
        uniqueKeys: {
          user_comment_like: {
            fields: ["userId", "commentId"],
          },
        },
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("UserCommentLikes");
  },
};
