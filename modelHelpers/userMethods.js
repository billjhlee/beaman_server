const { User, Token } = require("../models/index");
const bcrypt = require("bcryptjs");
const { createAuthToken } = require("./authHelpers");

const jwt = require("jsonwebtoken");

function CheckPassword(inputtxt) {
  if (inputtxt.length < 6) return false;
  else if (inputtxt.length > 30) return false;
  return true;
  // var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  // if (inputtxt.match(passw)) {
  //   return true;
  // } else {
  //   return false;
  // }
}

let createUser = async (data) => {
  if (!CheckPassword(data.password))
    return {
      error: "Password requirement failed",
      success: false,
    };
  try {
    const user = await User.create(data);
    return { data: user, success: true };
  } catch (error) {
    return { error, success: false };
  }
};

let login = async (data) => {
  try {
    const user = await User.findOne({
      where: { email: data.email },
    });
    if (!user) throw new Error("User not found");
    try {
      const isMatch = await bcrypt.compare(data.password, user.password);
      if (!isMatch) return { error: "wrong password", success: false };

      const { cookies, authToken } = await createAuthToken({
        userId: user.id.toString(),
      });
      return { data: { user, cookies }, success: true };
    } catch (error) {
      return { error, success: false };
    }
  } catch (error) {
    return { error, success: false };
  }
};

let UserMethods = {
  createUser,
  login,
};

module.exports = UserMethods;
