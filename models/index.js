"use strict";
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    ...config,
    logging: console.log
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config,
    logging: console.log
  });
}

// Models-----
// const UserModel = require("./user");
// const TokenModel = require("./token");
// const InvalidTokenModel = require("./invalidtoken");
// const ArticleModel = require("./article");
// const CommentModel = require("./comment");
// const PostModel = require("./Post");

// const User = UserModel(sequelize, Sequelize);
// const Token = TokenModel(sequelize, Sequelize);
// const InvalidToken = InvalidTokenModel(sequelize, Sequelize);
// const Article = ArticleModel(sequelize, Sequelize);
// const Comment = CommentModel(sequelize, Sequelize);

// const Post = PostModel(sequelize, Sequelize);

// Token.belongsTo(User);
// User.hasMany(Token);
//------------

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(file => {
    const model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// console.log(db.UserCommentLike);
// db.sequelize = sequelize;
// db.Sequelize = Sequelize;
// db.User = User;
// db.Token = Token;
// db.InvalidToken = InvalidToken;
// db.Article = Article;
// db.Comment = Comment;
// db.Post = Post;

module.exports = db;
