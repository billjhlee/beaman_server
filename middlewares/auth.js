const jwt = require("jsonwebtoken");
const { User, Token } = require("../models/index.js");
const { verifyIdToken } = require("../firebase");

const auth = async (req, res, next) => {
  try {
    const access_token = req.cookies["access_token"];
    if (access_token) {
      let result = await verifyIdToken(access_token);
      let user = await User.findOne({
        where: {
          email: result.email,
        },
      });
      if (user.user_id === undefined || user.user_id === null) {
        user.uid = result.user_id;
        await user.save();
      }
      req.user_obj = user;
      // console.log(user.username);
      req.user = {
        ...result,
        id: user.id,
        role: user.role,
        username: user.username,
      };
      if (req.body.userId === undefined || req.body.userId === null)
        req.body.userId = user.id;
    }
    // console.log(req.user);
    next();
  } catch (e) {
    console.log(e);
    next();
  }
};

module.exports = auth;
