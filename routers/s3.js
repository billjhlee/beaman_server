const express = require("express");
const { s3, params, createPresignedPost } = require("../aws");
const { sendResponse } = require("./utils");

const router = new express.Router();

router.get("/url", async (req, res) => {
  try {
    //   params.key =
    let paramskeyadded = { ...params, Key: req.query.key };
    let signedurl = s3.getSignedUrl("putObject", paramskeyadded);
    console.log("signedurl", signedurl);
    // let signedurl = await s3.createPresignedPost(params);
    sendResponse({ data: { url: signedurl }, success: true }, res);
  } catch (err) {
    sendResponse({ error: "try again" }, res);
  }
});
module.exports = router;
