const { UserArticleLike } = require("../models/index");

let createUserArticleLike = async (data) => {
  try {
    let UserArticleLike = UserArticleLike.create(data);
    return { data: UserArticleLike, success: true };
  } catch (err) {
    return { err, success: false };
  }
};

let findOrCreateUserArticleLike = async (data) => {
  try {
    const { like, ...rest } = data;
    let userArticleLike = await UserArticleLike.findOrCreate({
      where: rest,
    });
    userArticleLike[0].like = like;
    await userArticleLike[0].save();
    return { data: userArticleLike[0], success: true };
  } catch (err) {
    console.log(err);
    return { err, success: false };
  }
};

module.exports = {
  createUserArticleLike,
  findOrCreateUserArticleLike,
};
