const express = require("express");
const Sequelize = require("sequelize");
const ArticleMethods = require("../modelHelpers/articleMethods");
const moment = require("../moment");
const {
  fetchData,
  fetchDataOffset,
  fetchOne,
  updateOne,
  deleteOne,
  countData,
} = require("../modelHelpers/generalMethods");
const { queryParser, sendResponse } = require("./utils");
const { Article, User, Comment } = require("../models/index");

const sanitizeHtml = require("sanitize-html");
const { san_options, san_options_2 } = require("../modelHelpers/generalUtils");

let superProtected = new express.Router();
let editorProtected = new express.Router();
let ownershipProtected = new express.Router();
let authProtected = new express.Router();
let general = new express.Router();

authProtected.post("/", async (req, res) => {
  let result = await ArticleMethods.createArticle({
    username: req.user.username,
    ...req.body,
  });
  if (result.success) {
    req.user_obj.articles++;
    await req.user_obj.save();
  }
  sendResponse(result, res);
});

authProtected.post("/category", async (req, res) => {
  const query = queryParser(req.query);
  const categories = req.body.categories;
  const keywords = req.body.keywords;
  const attribute = req.body.attribute;
  if (categories === undefined || categories.length === 0)
    data = {
      where: {},
      ...query,
    };
  else
    data = {
      where: { category: categories },
      ...query,
    };
  data.model = Article;
  // data.order = [["createdAt", "DESC"]];
  data.include = [
    {
      model: User,
      as: "user_favs",
      required: false,
      attributes: ["id"],
      where: { id: req.user.id },
    },
  ];
  data.order = [
    ["createdAt", "DESC"],
    [{ model: User, as: "user_favs" }, "id", "DESC"],
  ];

  let result;
  // keywords------------------------
  if (keywords && keywords.length > 0) {
    let matches = {
      [Sequelize.Op.and]: keywords.map((keyword) => {
        return Sequelize.where(
          Sequelize.fn("lower", Sequelize.col(attribute)),
          {
            [Sequelize.Op.like]: `%${keyword}%`,
          }
        );
      }),
    };
    data.where = { ...data.where, ...matches };
    // if (req.body.first) {
    //   data.offset = req.body.offset;
    //   data.limit = req.body.limit;
    //   result = await fetchDataOffset(data);
    // } else
    result = await fetchData(data);
    //--------------------------------------------
  } else {
    result = await fetchData(data);
  }
  sendResponse(result, res);
});

ownershipProtected.post("/", async (req, res) => {
  let result = await updateOne({
    where: { id: req.body.id },
    changes: {
      title: sanitizeHtml(req.body.title, san_options_2),
      preview: sanitizeHtml(req.body.preview, san_options_2),
      content: sanitizeHtml(req.body.content, san_options),
    },
    model: Article,
    ownership: true,
    userId: req.user.id,
  });
  sendResponse(result, res);
});

ownershipProtected.get("/check", async (req, res) => {
  let result = await Article.findOne({
    where: { id: req.query.id },
  });
  if (result.userId === req.user.id) {
    sendResponse({ success: true, data: result }, res);
  } else sendResponse({ error: "Unauthorized", success: false }, res);
});

ownershipProtected.post("/update", async (req, res) => {
  let result1 = await Article.findOne({
    where: { id: req.body.id },
  });
  if (result1.userId === req.user.id) {
    let changes = {};
    if (req.body.title)
      changes.title = sanitizeHtml(req.body.title, san_options_2);
    if (req.body.content)
      changes.content = sanitizeHtml(req.body.content, san_options);
    let result = await updateOne({
      where: { id: req.body.id },
      changes,
      model: Article,
    });
    sendResponse(result, res);
  } else sendResponse({ error: "Unauthorized", success: false }, res);
});

editorProtected.post("/", async (req, res) => {
  let result = await ArticleMethods.createArticle({
    username: req.user.username,
    ...req.body,
  });
  sendResponse(result, res);
});

editorProtected.post("/update", async (req, res) => {
  let result = await updateOne({
    where: { id: req.body.id },
    changes: {
      content: req.body.content,
    },
    model: Article,
  });
  sendResponse(result, res);
});

superProtected.post("/delete", async (req, res) => {
  let result = await ArticleMethods.deleteArticle(req.body);
  sendResponse(result, res);
});

ownershipProtected.delete("/:id", async (req, res) => {
  let result = await deleteOne({
    where: { id: req.params.id },
    model: Article,
    ownership: true,
    userId: req.user.id,
  });
  sendResponse(result, res);
});

general.get("/user/:id", async (req, res) => {
  let query = queryParser(req.query);

  let result = await fetchData({
    where: {
      userId: req.params.id,
    },
    model: Article,
    ...query,
  });

  sendResponse(result, res);
});

general.post("/recommended", async (req, res) => {
  let query = queryParser(req.query);
  const { categories } = req.body;
  let data = {
    where: { type: "post" },
    ...query,
  };
  if (categories.length > 0) {
    data.where.category = { $in: req.body.categories };
  }
  data.model = Article;
  let result = await fetchData(data);
  sendResponse(result, res);
});
general.post("/category/pages", async (req, res) => {
  const categories = req.body.categories;
  const userIds = req.body.userIds;
  let where = {};

  if (categories === undefined || categories.length === 0) {
    data = {
      where,
    };
  } else {
    data = {
      where: { ...where, category: categories },
    };
  }
  if (userIds !== undefined && userIds.length > 0) {
    data.where = { ...data.where, userId: userIds };
  }

  data.model = Article;
  let result = await countData(data);
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
  data = { where, ...query, model: Article };
  data.order = [["likes", "DESC"]];

  let result = await fetchData(data);

  // console.log("RESULT", result);
  sendResponse(result, res);
});

general.post("/category", async (req, res) => {
  const { date, ...query } = queryParser(req.query);
  const categories = req.body.categories;
  const userIds = req.body.userIds;
  const favs = req.body.favs;

  const keywords = req.body.keywords;
  const attribute = req.body.attribute;
  let where = {};
  if (date) {
    where = {
      createdAt: {
        [Sequelize.Op.lte]: date,
      },
    };
  }
  // console.log("where", where);
  if (categories === undefined || categories.length === 0)
    data = {
      where,
      ...query,
    };
  else
    data = {
      where: { ...where, category: categories },
      ...query,
    };

  if (userIds !== undefined && userIds.length > 0) {
    data.where = { ...data.where, userId: userIds };
  }
  data.model = Article;
  data.order = [["createdAt", "DESC"]];
  if (req.user) {
    data.include = [
      {
        model: User,
        required: favs ? favs : false,
        as: "user_favs",
        attributes: ["id"],
        where: { id: req.user.id },
      },
    ];
    data.order = [
      ...data.order,
      [{ model: User, as: "user_favs" }, "id", "DESC"],
    ];
  }
  data.include.push({ model: User, attributes: ["id", "thumbnail"] });

  let result;
  // keywords------------------------
  if (keywords && keywords.length > 0) {
    let matches = {
      [Sequelize.Op.and]: keywords.map((keyword) => {
        return Sequelize.where(
          Sequelize.fn("lower", Sequelize.col(attribute)),
          {
            [Sequelize.Op.like]: `%${keyword}%`,
          }
        );
      }),
    };
    data.where = { ...data.where, ...matches };
    // not used
    if (req.body.first) {
      data.offset = req.body.offset;
      data.limit = req.body.limit;
      result = await fetchDataOffset(data);
    } else result = await fetchData(data);
    //--------------------------------------------
  } else {
    // console.log(data);
    result = await fetchData(data);
  }
  sendResponse(result, res);
});

general.get("/:id", async (req, res) => {
  let data = {
    where: { id: req.params.id },
    model: Article,
  };
  if (req.user) {
    data.include = [
      {
        model: User,
        attributes: ["id", "email", "thumbnail"],
        include: [
          {
            model: User,
            required: false,
            as: "user_followed_by",
            attributes: ["id"],
            where: { id: req.user.id },
          },
        ],
      },
      {
        model: User,
        required: false,
        as: "users_liked",
        attributes: ["id"],
        where: { id: req.user.id },
      },
      {
        model: User,
        required: false,
        as: "user_favs",
        attributes: ["id"],
        where: { id: req.user.id },
      },
    ];
  } else {
    data.include = [{ model: User, attributes: ["id", "email"] }];
  }
  let result = await fetchOne(data);
  if (result.data) {
    result.data.result.views++;
    await result.data.result.save();
  }
  sendResponse(result, res);
});

module.exports = {
  superProtected,
  editorProtected,
  ownershipProtected,
  authProtected,
  general,
};
