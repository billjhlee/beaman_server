"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "UserArticleLikes",
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
        articleId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: {
              tableName: "Articles",
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
        user_article_like: {
          fields: ["userId", "articleId"],
        },
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("UserArticleLikes");
  },
};
