const express = require("express");
const CommentMethods = require("../modelHelpers/commentMethods");
const { fetchData } = require("../modelHelpers/generalMethods");
const { queryParser, sendResponse } = require("./utils");
const { User, Comment, UserCommentLike } = require("../models/index");
const Sequelize = require("sequelize");
const moment = require("../moment");

const sanitizeHtml = require("sanitize-html");
const { san_options_2 } = require("../modelHelpers/generalUtils");

let superProtected = new express.Router();
let editorProtected = new express.Router();
let authProtected = new express.Router();
let ownershipProtected = new express.Router();
let general = new express.Router();

authProtected.post("/", async (req, res) => {
  let data = { ...req.body, userId: req.user.id, username: req.user.username };
  let result;
  if (data.content.length === 0 || data.content.length > 50) {
    result = { error: "length", success: false };
  } else {
    data.content = sanitizeHtml(data.content, san_options_2);
    result = await CommentMethods.createComment(data);
    result = { data: { comment: result, user: req.user_obj }, success: true };
  }
  // result.data = { }
  sendResponse(result, res);
});

superProtected.post("/delete", async (req, res) => {
  let result = await CommentMethods.deleteComment(req.body);
  sendResponse(result, res);
});

ownershipProtected.delete("/delete/:id", async (req, res) => {
  // console.log(req.query);
  try {
    let result = await Comment.findOne({ where: { id: req.params.id } });
    if (result.userId === req.user.id) {
      await result.destroy();
      sendResponse({ success: true }, res);
    } else sendResponse({ success: false, error: "ownership" }, res);
  } catch (error) {
    console.log(error);
    sendResponse({ error, success: false }, res);
  }
  // let result = await CommentMethods.deleteComment(req.body);
  // let result;/
});

ownershipProtected.post("/update", async (req, res) => {
  try {
    let result = await Comment.findOne({ where: { id: req.body.id } });
    if (result.userId === req.user.id) {
      result.content = sanitizeHtml(req.body.content, san_options_2);
      await result.save();
      sendResponse({ success: true, data: result }, res);
    } else sendResponse({ success: false, error: "ownership" }, res);
  } catch (error) {
    console.log(error);
    sendResponse({ error, success: false }, res);
  }
  // let result = await CommentMethods.deleteComment(req.body);
  // let result;/
});

general.post("/recommended", async (req, res) => {
  let query = queryParser(req.query);
  const { categories } = req.body;
  let data = {
    ...query,
  };
  if (categories.length > 0) {
    data.where.category = { $in: req.body.categories };
  }
  data.model = Comment;
  let result = await fetchData(data);
  sendResponse(result, res);
});

general.get("/:id", async (req, res) => {
  let result = await fetchData({
    where: {
      id: req.params.id,
    },
    model: Comment,
  });
  sendResponse(result, res);
});

general.post("/popular/:type", async (req, res) => {
  const query = queryParser(req.query);
  let date;
  if (req.params.type == "0") {
    date = moment().startOf("day");
    // date.setHours(0, 0, 0, 0);
    // date.setDate(date.getDate() - 1);
  } else if (req.params.type == "1") {
    // let day = date.getDay(),
    //   diff = date.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    // date.setDate(diff);
    // date.setHours(0, 0, 0, 0);
    date = moment().startOf("week");
  } else {
    date = moment().startOf("month");

    // date = new Date(date.getFullYear(), date.getMonth(), 1);
  }
  date = date.toDate();
  const categories = req.body;
  let where = {
    createdAt: {
      [Sequelize.Op.gte]: date,
    },
  };
  data = { where, ...query, model: Comment };
  data.order = [["likes", "DESC"]];

  let result = await fetchData(data);

  // console.log("RESULT", result);
  sendResponse(result, res);
});

general.get("/user/:id", async (req, res) => {
  let query = queryParser(req.query);

  let result = await fetchData({
    where: {
      userId: req.params.id,
    },
    model: Comment,
    ...query,
  });
  sendResponse(result, res);
});

general.get("/article/:id", async (req, res) => {
  let query = queryParser(req.query);
  console.log("adsfasdfasfdasdf", query);

  let result = await fetchData({
    where: {
      articleId: req.params.id,
      parentId: null,
      // attributes: {
      //   include: [
      //     [
      //       Sequelize.fn("COUNT", Sequelize.col("UserCommentLike.id")),
      //       "like_count",
      //     ],
      //   ],
      // },
      // "$users_liked.UserCommentLike.userId$": 53,
    },
    include: [
      {
        model: User,
        as: "users_liked",
        attributes: ["id"],
        required: false,
        where: {
          id: req.user ? req.user.id : null,
          // id: {
          //   [Sequelize.Op.ne]: null,
          // },
        },
        // order: [["id", "DESC"]],
        required: false,
      },
      { model: User },
      { model: Comment, limit: 1 },
      // {
      //   model: UserCommentLike,
      //   attributes: ["commentId", "userId"],
      // },
    ],
    model: Comment,
    ...query,
    order: [
      ["createdAt", "DESC"],
      [{ model: User, as: "users_liked" }, "id", "DESC"],
      // ["users_liked.id", "ASC"],
    ],
  });
  // for (let i = 0; i < result.data.result.length; i++) {
  //   result.data.result[i].dataValues.UserCommentLikes =
  //     result.data.result[i].dataValues.UserCommentLikes.length;
  // }
  // console.log(result);
  sendResponse(result, res);
});

general.get("/:id/comments", async (req, res) => {
  let query = queryParser(req.query);
  let result = await fetchData({
    where: {
      parentId: req.params.id,
    },
    include: [
      {
        model: User,
        required: false,
        as: "users_liked",
        where: { id: req.user ? req.user.id : null },
        attributes: ["id"],
      },
      { model: User },
      // { model: UserCommentLike },
    ],
    model: Comment,
    ...query,
    order: [
      ["createdAt", "DESC"],
      [{ model: User, as: "users_liked" }, "id", "DESC"],
    ],
  });
  sendResponse(result, res);
});

module.exports = {
  authProtected,
  superProtected,
  editorProtected,
  ownershipProtected,
  general,
};
