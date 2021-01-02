"use strict";
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      // paranoid: true
    }
  );
  Post.associate = function (models) {
    // Post.belongsTo(models.User);
    // Post.hasMany(models.Comment);
    // associations can be defined here
  };
  return Post;
};
