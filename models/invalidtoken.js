"use strict";
module.exports = (sequelize, DataTypes) => {
  const InvalidToken = sequelize.define("InvalidToken", {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  InvalidToken.associate = function(models) {
    InvalidToken.belongsTo(models.User);
  };
  return InvalidToken;
};
