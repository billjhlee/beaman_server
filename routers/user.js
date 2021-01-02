const express = require("express");
const Sequelize = require("sequelize");
const UserMethods = require("../modelHelpers/userMethods");
const UserImageMethods = require("../modelHelpers/userImageMethods");
const { queryParser, sendResponse } = require("./utils");
const { paginate } = require("../modelHelpers/generalUtils");

const {
  fetchData,
  fetchOne,
  updateOne,
} = require("../modelHelpers/generalMethods");
const { User, UserImage, UserFollow, Article } = require("../models/index");
const JWTDecode = require("jwt-decode");
const sanitizeHtml = require("sanitize-html");
const { san_options_2 } = require("../modelHelpers/generalUtils");

const router = new express.Router();
const editorRouter = new express.Router();
const authRouter = new express.Router();

editorRouter.get("/check", async (req, res) => {
  if (req.user) sendResponse({ success: true }, res);
  sendResponse({ error: "Please login" }, res);
});

authRouter.get("/check", async (req, res) => {
  if (req.user) sendResponse({ success: true }, res);
  sendResponse({ error: "Please login" }, res);
});

authRouter.get("/followers", async (req, res) => {
  try {
    let result = await User.findOne({
      where: { id: req.user.id },
      include: [
        {
          model: User,
          as: "user_follows",
          attributes: ["id", "username"],
          required: false,
        },
      ],
    });
    sendResponse({ success: true, data: result }, res);
  } catch (err) {
    sendResponse({ err: "try again" }, res);
  }
});

editorRouter.get("/", async (req, res) => {
  if (req.user) {
    // console.log(req.user);
    if (req.query.email === req.user.email) {
      // let user = await User.findOne({ where: { email: req.user.email } });
      sendResponse({ success: true, data: { user: req.user } }, res);
    } else {
      sendResponse({ error: "Unauthorized Attempt" }, res);
    }
  } else sendResponse({ error: "Please login" }, res);
});

router.get("/type", async (req, res) => {
  const { email } = req.query;
  let user = await User.findOne({ where: { email } });
  // console.log(user);
  if (user) {
    if (user.password === null) {
      sendResponse({ success: true, data: { type: "social" } }, res);
    } else {
      sendResponse({ success: true, data: { type: "local" } }, res);
    }
  } else {
    sendResponse({ error: "없는 유저입니다! 가입해주세요!" }, res);
  }
});

router.get("/", async (req, res) => {
  if (req.user) {
    if (req.query.email === req.user.email) {
      let user = await User.findOne({ where: { email: req.user.email } });

      sendResponse({ success: true, data: { user: user } }, res);
    } else {
      sendResponse({ error: "Unauthorized Attempt" }, res);
    }
  } else sendResponse({ error: "Please login" }, res);
});
// router.get("/:id/articles", async (req, res) => {
//   let result = await fetchOne({
//     where: { id: req.params.id },
//     model: User,
//     include: [{ model: Article }],
//   });
//   console.log("resutl", result);

//   sendResponse(result, res);
// });

router.get("/ranks", async (req, res) => {
  let result = await fetchData({
    model: User,
    limit: 10,
    order: [["score", "DESC"]],
  });

  sendResponse(result, res);
});

router.get("/:id/articles", async (req, res) => {
  const query = queryParser(req.query);

  let result = await fetchOne({
    where: { id: req.params.id },
    model: User,
    include: [{ model: Article, required: false, ...paginate({}, query) }],
  });
  sendResponse(result, res);
});

router.get("/:id/f", async (req, res) => {
  let data = {
    where: { id: req.params.id },
    model: User,
  };
  if (req.user) {
    data.include = [
      {
        model: User,
        as: "user_followed_by",
        required: false,
        attributes: ["id", "username"],
        where: { id: req.user.id },
      },
    ];
  }
  let result = await fetchOne(data);

  sendResponse(result, res);
});

router.get("/:id", async (req, res) => {
  let result = await fetchOne({
    where: { id: req.params.id },
    model: User,
  });
  sendResponse(result, res);
});

router.get("/email/:email", async (req, res) => {
  let result = await fetchOne({
    where: { email: req.params.email },
    model: User,
  });
  sendResponse(result, res);
});

router.get("/:id/images", async (req, res) => {
  let result = await fetchOne({
    where: { id: req.params.id },
    model: User,
    include: [{ model: UserImage, required: false, limit: 3 }],
  });
  sendResponse(result, res);
});

router.post("/", async (req, res) => {
  // console.log(req.body);
  if (req.body.social) {
    const { email } = req.body;
    let user = await User.findOrCreate({
      where: { email: sanitizeHtml(email, san_options_2) },
    });
    if (
      user[0].password !== undefined &&
      user[0].password !== null &&
      user[0].password !== ""
    )
      user[0].password = null;
    // if (
    //   user[0].username === undefined ||
    //   user[0].username === null ||
    //   user[0].username === ""
    // )
    // let userfind = await User.findOne()
    // user[0].username = sanitizeHtml(req.body.username, san_options_2);
    await user[0].save();

    sendResponse({ data: user, success: true }, res);
  } else {
    if (req.body.password.length < 6 || req.body.password.length > 30) {
      sendResponse(
        { error: "패스워드 6자 이상 30자 이하 여야합니다", success: false },
        res
      );
    }
    if (req.body.username.length < 1 || req.body.username.length > 20) {
      sendResponse(
        { error: "유저네임은 1자 이상 20자 이하여야합니다", success: false },
        res
      );
    }
    let result = await UserMethods.createUser(req.body);
    sendResponse(result, res);
  }
});

router.post("/update", async (req, res) => {
  console.log("BODYYY", req.body);
  if (req.body.email === req.user.email) {
    let data = {
      where: { email: req.user.email },
      changes: {
        username: sanitizeHtml(req.body.username, san_options_2),
      },
      model: User,
    };
    if (req.body.thumbnail) {
      data.changes.thumbnail = sanitizeHtml(req.body.thumbnail, san_options_2);
    }
    let result = await updateOne(data);
    sendResponse(result, res);
  } else {
    sendResponse({ error: "Unauthorized Attempt" }, res);
  }
});

// router.post("/userr", async (req, res) => {
//   let decoded = JWTDecode(req.body.token);
//   let result = await updateOne({
//     where: { email: decoded.email },
//     changes: {
//       uid: decoded.user_id
//     }
//   });
//   sendResponse(result, res);
// });

router.post("/login", async (req, res) => {
  let result = await UserMethods.login(req.body);

  sendResponse(result, res);
});

router.delete("/", async (req, res) => {
  let email = req.query.email;
  // console.log(email);
  try {
    let result = await User.findOne({ where: { email } });
    if (!result.uid) {
      await result.destroy();
      sendResponse({ success: true });
    }
    sendResponse({ error: "Unauthorized Attempt" }, res);
  } catch (err) {
    sendResponse({ error: "Please try again" }, res);
  }
});

router.get("/:id/images", async (req, res) => {
  let result = await fetchData({
    where: { id: req.params.id },
    model: UserImage,
    limit: 3,
  });

  sendResponse(result, res);
});
module.exports = { router, editorRouter, authRouter };

// router.get("/user/:id", async (req, res) => {
//   let result = await
// })

// router.post("/user/signout", async (req, res) => {
//   let result = await UserMethods.signout(req.body);
//   if (result.success) {
//     res.status(200).send(result.data);
//   } else {n
//     res.status(400).send(result.error);
//   }
// });
