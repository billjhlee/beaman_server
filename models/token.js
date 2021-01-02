"use strict";
module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define("Token", {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    expiresIn: {
      type: DataTypes.DATE
    }
  });
  Token.associate = function(models) {
    Token.belongsTo(models.User);
  };
  return Token;
};
