const express = require("express");
// const Sequelize = require("sequelize");
// const UserMethods = require("../modelHelpers/userMethods");
// const UserImageMethods = require("../modelHelpers/userImageMethods");
const { queryParser, sendResponse } = require("./utils");
const { paginate } = require("../modelHelpers/generalUtils");

const {
  fetchData,
  fetchOne,
  updateOne,
} = require("../modelHelpers/generalMethods");
const { User, UserFollow, Article } = require("../models/index");
const JWTDecode = require("jwt-decode");
// const sanitizeHtml = require("sanitize-html");
// const { san_options_2 } = require("../modelHelpers/generalUtils");

// const router = new express.Router();
// const editorRouter = new express.Router();
const authProtected = new express.Router();

authProtected.post("/:id", async (req, res) => {
  try {
    let result = await UserFollow.create({
      followerId: req.user.id,
      followedId: req.params.id,
    });
    sendResponse({ success: true }, res);
  } catch (err) {
    console.log(err);
    sendResponse({ error: "Bad Attempt" }, res);
  }
});

authProtected.delete("/:id", async (req, res) => {
  try {
    let result = await UserFollow.findOne({
      followerId: req.user.id,
      followedId: req.params.id,
    });
    await result.destroy();
    sendResponse({ success: true }, res);
  } catch (err) {
    console.log(err);
    sendResponse({ error: "Bad Attempt" }, res);
  }
});

module.exports = {
  authProtected,
};
