const express = require("express");
const {
  fetchData,
  updateOne,
  deleteOne,
} = require("../modelHelpers/generalMethods");
const { queryParser, sendResponse } = require("./utils");
const { UserFavorites } = require("../models/index");

let authProtected = new express.Router();

authProtected.post("/", async (req, res) => {
  try {
    const { articleId } = req.body;
    let userfavorites = await UserFavorites.create({
      userId: req.user.id,
      articleId,
    });
    sendResponse(
      {
        data: userfavorites,
        success: true,
      },
      res
    );
  } catch (err) {
    console.log(err);
    sendResponse(
      {
        error: err,
        success: false,
      },
      res
    );
  }
});

authProtected.delete("/:id", async (req, res) => {
  let result = await deleteOne({
    where: { userId: req.user.id, articleId: parseInt(req.params.id) },
    model: UserFavorites,
  });
  sendResponse(result, res);
});

module.exports = { authProtected };
