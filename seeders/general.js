let faker = require("faker");
let { models, counts } = require("./info");
let { createUser } = require("../modelHelpers/userMethods");
let { createArticle } = require("../modelHelpers/articleMethods");
let { createComment } = require("../modelHelpers/commentMethods");
let {
  createUserCommentLike,
} = require("../modelHelpers/userCommentLikeMethods");
let { createUserImage } = require("../modelHelpers/userImageMethods");
let fns = {
  createUser,
  createArticle,
  createComment,
  createUserCommentLike,
  createUserImage,
};

let seedGeneral = (name, Data, number) => {
  // console.log(Object.keys(Data));
  for (let i = 0; i < number; i++) {
    let fakeData = {};
    Object.keys(Data).forEach((attribute) => {
      if (Data[attribute].length > 2) {
        fakeData[attribute] = faker[Data[attribute][0]][Data[attribute][1]](
          Data[attribute][2]
        );
      } else
        fakeData[attribute] = faker[Data[attribute][0]][Data[attribute][1]]();
    });
    if (name == "Comment" && i < number / 2) {
      fakeData["parentId"] = null;
    } else if (name == "UserImage") {
      fakeData["imageUrl"] =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/480px-JavaScript-logo.png";
    }
    fns["create" + name](fakeData);
  }
};

let seedAll = () => {
  for (let i = 0; i < Object.keys(models).length; i++) {
    seedGeneral(
      Object.keys(models)[i],
      models[Object.keys(models)[i]],
      counts[Object.keys(models)[i]]
    );
  }
};

seedAll();

module.exports = seedGeneral;
