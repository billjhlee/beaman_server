"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserImage = sequelize.define(
    "UserImage",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );
  UserImage.associate = function(models) {
    UserImage.belongsTo(models.User, {
      targetKey: "id",
      foreignKey: "userId"
    });
    // associations can be defined here
  };
  return UserImage;
};
