const { User, Token, InvalidToken } = require("../models/index");
const moment = require("moment");
const jwt = require("jsonwebtoken");

const createAuthToken = async (params, options = { expiresIn: "30m" }) => {
  const prevTokens = await Token.findAll({
    where: {
      userId: params.userId
    }
  });

  let latest;
  if (prevTokens) {
    prevTokens.forEach(token => {
      if (moment().diff(moment(token.expiresIn), "seconds") > 3600) {
        token.destroy().catch(e => {
          throw new Error(e);
        });
      } else {
        latest = token;
      }
    });
  }
  let authToken;
  latest = "";
  if (latest) {
    authToken = prevTokens.pop().token;
  } else {
    authToken = jwt.sign({ id: params.userId }, "secretkey", options);
    try {
      const token = await Token.create({
        token: authToken,
        userId: params.userId,
        expiresIn: moment()
          .add(30, "minutes")
          .utc()
          .format()
      });
    } catch (e) {
      throw new Error(e);
    }
  }
  const tokenParts = authToken.split(".");
  const cookies = [
    [
      "token1",
      tokenParts[0] + "." + tokenParts[1],
      { httpOnly: true, sameSite: true }
    ],
    ["token2", tokenParts[2], { sameSite: true }]
  ];
  return { cookies, authToken };
};

const invalidatePrevTokens = async params => {
  const prevTokens = await Token.findAll({
    where: {
      userId: params.userId
    }
  });

  if (prevTokens) {
    prevTokens.forEach(async prevToken => {
      try {
        await InavlidToken.create({
          token: prevToken.token,
          userId: params.userId
        });
        prevToken.destroy();
      } catch (e) {
        throw new Error(e);
      }
    });
  }
};

const authHelpers = {
  createAuthToken,
  invalidatePrevTokens
};

module.exports = authHelpers;
