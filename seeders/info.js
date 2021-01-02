const faker = require("faker");

models = {
  User: {
    uid: ["name", "firstName"],
    firstName: ["name", "firstName"],
    lastName: ["name", "lastName"],
    userName: ["internet", "userName"],
    description: ["lorem", "sentence"],
    email: ["internet", "email"],
    password: ["internet", "password"],
    role: ["random", "arrayElement", ["super", "general", "partner", "editor"]],
  },
  Article: {
    title: ["name", "title"],
    preview: ["lorem", "sentence"],
    content: ["lorem", "paragraph"],
    userId: ["random", "number", { min: 1, max: 50 }],
    type: ["random", "arrayElement", ["article", "post"]],
    category: ["random", "number", { max: 9 }],
  },
  Comment: {
    content: ["lorem", "sentence"],
    userId: ["random", "number", { min: 1, max: 50 }],
    articleId: ["random", "number", { min: 1, max: 250 }],
    parentId: ["random", "number", { min: 1, max: 1000 }],
  },
  UserCommentLike: {
    userId: ["random", "number", { min: 51, max: 51 }],
    commentId: ["random", "number", { min: 1, max: 1000 }],
    like: ["random", "boolean"],
  },
  UserImage: {
    userId: ["random", "number", { min: 1, max: 51 }],
  },
};

counts = {
  // User: 50,
  // Article: 250,
  Comment: 1000,
  // UserCommentLike: 3000,
  // UserImage: 150,
};

module.exports = { models, counts };
