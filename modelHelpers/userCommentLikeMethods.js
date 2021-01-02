const { UserCommentLike } = require("../models/index");

let createUserCommentLike = async (data) => {
  try {
    let userCommentLike = UserCommentLike.create(data);
    return { data: userCommentLike, success: true };
  } catch (err) {
    return { err, success: false };
  }
};

let findOrCreateUserCommentLike = async (data) => {
  try {
    const { like, ...rest } = data;
    let userCommentLike = await UserCommentLike.findOrCreate({ where: rest });
    userCommentLike[0].like = like;
    await userCommentLike[0].save();
    return { data: userCommentLike[0], success: true };
  } catch (err) {
    console.log(err);
    return { err, success: false };
  }
};

module.exports = {
  createUserCommentLike,
  findOrCreateUserCommentLike,
};
