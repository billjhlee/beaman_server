"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uid: {
        unique: true,
        allowNull: true,
        type: Sequelize.STRING,
      },
      score: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      articles: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      comments: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      // firstName: {
      //   type: Sequelize.STRING
      // },
      // lastName: {
      //   type: Sequelize.STRING
      // },
      thumbnail: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      emailverified: {
        type: Sequelize.BOOLEAN,
        default: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      role: {
        type: Sequelize.ENUM("super", "editor", "general", " partner"),
        defaultValue: "general",
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Users");
  },
};
