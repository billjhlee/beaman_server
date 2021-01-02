const express = require("express");
const Sequelize = require("sequelize");

const { queryParser, sendResponse } = require("./utils");
const { User, UserCheckIn, CheckInStats } = require("../models/index");

const { fetchData, fetchOne } = require("../modelHelpers/generalMethods");

const moment = require("../moment");

const sanitizeHtml = require("sanitize-html");
const { san_options, san_options_2 } = require("../modelHelpers/generalUtils");

let authProtected = new express.Router();
let general = new express.Router();

general.get("/rank", async (req, res) => {
  const { align, ...rest } = req.query;
  rest.pageSize = 5;
  rest.nextPage = 0;
  const query = queryParser(rest);
  console.log("QUERY", query);

  let result = await fetchData({
    model: CheckInStats,
    where: {},
    ...query,
    order: [[align, "DESC"]],
    include: [{ model: User }],
  });

  sendResponse(result, res);
});

general.get("/", async (req, res) => {
  const { date, ...rest } = req.query;
  const query = queryParser(rest);
  let _date;
  if (date) _date = moment(date).startOf("day").toDate();
  else _date = moment().startOf("day").toDate();
  let result = await fetchData({
    model: UserCheckIn,
    where: {
      createdAt: {
        [Sequelize.Op.gte]: _date,
      },
    },
    include: [{ model: User, attributes: ["id", "thumbnail"] }],
    ...query,
  });
  sendResponse(result, res);
});

authProtected.get("/info", async (req, res) => {
  let result = await fetchOne({
    model: CheckInStats,
    where: { userId: req.user.id },
  });

  sendResponse(result, res);
});

authProtected.post("/", async (req, res) => {
  try {
    // console.log("asdfasdfasdfasdfasfd");
    // console.log("user", req.uer);
    req.body.username = req.user.username;

    // console.log(moment().startOf("day").toDate());
    // let where = {
    //   createdAt: {
    //     [Sequelize.Op.gte]: moment().startOf("day").toDate(),
    //   },
    // };

    let is_first = await UserCheckIn.findOne({
      where: {
        createdAt: {
          [Sequelize.Op.gte]: moment().startOf("day").toDate(),
        },
      },
    });

    let result = await UserCheckIn.findOne({
      where: {
        userId: req.user.id,
        username: req.user.username,
        createdAt: {
          [Sequelize.Op.gte]: moment().startOf("day").toDate(),
        },
      },
    });

    if (result) {
      // result[0].content = req.body.content;
      sendResponse({ data: false, success: true }, res);
      return;
      // await result[0].save();
    } else {
      // sendResponse({ data: false, success: true }, res);
      result = await UserCheckIn.create({
        userId: req.user.id,
        username: req.user.username,
        content: req.body.content,
      });
    }
    // let checkinstats = await CheckInStats.findOne({
    //   where: { userId: req.user.id },
    // });

    // if (!checkinstats)
    let checkinstats = await CheckInStats.findOrCreate({
      where: { userId: req.user.id },
    });

    // console.log("hello", checkinstats);
    if (
      moment(checkinstats[0].updatedAt) >=
      moment().startOf("day").subtract(1, "days")
    )
      checkinstats[0].consecutive++;
    else {
      checkinstats[0].consecutive = 1;
    }
    checkinstats[0].total++;
    if (!is_first) checkinstats[0].first++;
    checkinstats[0].save();
    sendResponse(
      {
        data: {
          result: {
            checkin: result,
            stats: checkinstats[0],
            user: req.user_obj,
          },
        },
        success: true,
      },
      res
    );
  } catch (error) {
    console.log(error);
    sendResponse({ error: "try again", success: false }, res);
  }
});

module.exports = {
  general,
  authProtected,
};
