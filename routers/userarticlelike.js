const express = require("express");
const UserArticleLikeMethods = require("../modelHelpers/userArticleLikeMethods");
const {
  fetchData,
  updateOne,
  deleteOne,
} = require("../modelHelpers/generalMethods");
const { queryParser, sendResponse } = require("./utils");
const { UserArticleLike, Article } = require("../models/index");

// let superProtected = new express.Router();
// let editorProtected = new express.Router();
let authProtected = new express.Router();
// let ownershipProtected = new express.Router();
// let general = new express.Router();

authProtected.post("/", async (req, res) => {
  const { waslike, wasdislike, ...rest } = req.body;
  let result = await UserArticleLikeMethods.findOrCreateUserArticleLike({
    ...rest,
    userId: req.user.id,
  });
  try {
    let updated = await Article.findOne({
      where: {
        id: req.body.articleId,
      },
    });
    if (wasdislike) {
      updated.dislikes -= 1;
    } else if (waslike) {
      updated.likes -= 1;
    }
    if (req.body.like) {
      updated.likes += 1;
    } else {
      updated.dislikes += 1;
    }
    await updated.save();
    result.data = {
      result: result.data,
      likes: updated.likes,
      dislikes: updated.dislikes,
    };

    sendResponse(result, res);
  } catch (err) {
    sendResponse({ error: "try again", success: false }, res);
  }
});

authProtected.post("/like", async (req, res) => {
  let result = await updateOne({
    where: {
      id: req.body.id,
    },
    changes: req.body.changes,
    model: UserArticleLike,
  });
  sendResponse(result, res);
});

authProtected.delete("/", async (req, res) => {
  let result = await deleteOne({
    where: { userId: req.user.id, articleId: req.query.articleId },
    model: UserArticleLike,
  });
  try {
    let updated = await Article.findOne({
      where: {
        id: req.query.articleId,
      },
    });
    if (req.query.like === "true") updated.likes -= 1;
    else updated.dislikes -= 1;
    await updated.save();
    result.data = { likes: updated.likes, dislikes: updated.dislikes };
    sendResponse(result, res);
  } catch (err) {
    sendResponse({ error: "try again", success: false }, res);
  }
});

module.exports = { authProtected };
