const { UserImage } = require("../models/index");

let createUserImage = async data => {
  try {
    let userImage = await UserImage.create(data);
    return { data: userImage, success: true };
  } catch (err) {
    return { err, success: false };
  }
};

module.exports = {
  createUserImage
};
