const express = require("express");
const cookieParser = require("cookie-parser");
const middlewares = require("./middlewares/index.js");
let cors = require("cors");
var whitelist = [
  "http://beerman.co.kr",
  "https://beerman.co.kr",
  "http://www.beerman.co.kr",
  "https://www.beerman.co.kr",
  "http://localhost:3000",
];

var corsOptions = {
  origin: function (origin, callback) {
    if (origin === undefined || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204,
  credentials: true,
  allowedHeaders: "Content-Type, *",
  methods: "GET, POST, PUT, DELETE, OPTIONS, *",
};

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "./.env" });
}

const user_router = require("./routers/user");
const article_router = require("./routers/article");
const comment_router = require("./routers/comment");
const user_comment_like_router = require("./routers/usercommentlike");
const user_article_like_router = require("./routers/userarticlelike");
const user_follow_router = require("./routers/userfollow");
const check_in_router = require("./routers/checkin");

const s3_router = require("./routers/s3");
const user_favorites_router = require("./routers/userfavorites");
const app = express();
const port = process.env.PORT || 5000;

// app.get('/*', function (req, res, next) {
//   res.header('Access-Control-Allow-Credentials', true);
//   next(); // http://expressjs.com/guide.html#passing-route control
//   //ewqr
// });
// app.use(cookieParser());
app.use(express.json());
app.use(cookieParser());

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.header('Access-Control-Allow-Credentials', 'true')
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Cookie,*')
//   res.header('Access-Control-Allow-Methods', '*')

//   next(); // http://expressjs.com/guide.html#passing-route control
// });
// app.use(cors(corsOptions))
app.use(cors(corsOptions));

app.use(middlewares.authGuard);
app.use("/user", [], user_router.router);
app.use("/3/user", [middlewares.authenticated], user_router.authRouter);
app.use(
  "/1/user",
  [middlewares.authenticated, middlewares.editor_role],
  user_router.editorRouter
);
app.use("/photo/upload", s3_router);

app.use("/checkin", check_in_router.general);

app.use(
  "/3/checkin",
  [middlewares.authenticated],
  check_in_router.authProtected
);

//article router
app.use(
  "/0/article",
  [middlewares.authenticated, middlewares.super_role],
  article_router.superProtected
);
app.use(
  "/1/article",
  [middlewares.authenticated, middlewares.editor_role],
  article_router.editorProtected
);
app.use(
  "/2/article",
  [middlewares.authenticated],
  article_router.ownershipProtected
);
app.use("/3/article", middlewares.authenticated, article_router.authProtected);
app.use("/article", article_router.general);

//comment router
app.use(
  "/0/comment",
  [middlewares.authenticated, middlewares.super_role],
  comment_router.superProtected
);
app.use(
  "/1/comment",
  [middlewares.authenticated, middlewares.editor_role],
  comment_router.editorProtected
);
app.use(
  "/2/comment",
  [middlewares.authenticated],
  comment_router.ownershipProtected
);

app.use(
  "/3/comment",
  [middlewares.authenticated],
  comment_router.authProtected
);

app.use("/comment", comment_router.general);

app.use(
  "/like/comment",
  [middlewares.authenticated],
  user_comment_like_router.authProtected
);
app.use(
  "/like/article",
  [middlewares.authenticated],
  user_article_like_router.authProtected
);

app.use(
  "/favorite/article",
  [middlewares.authenticated],
  user_favorites_router.authProtected
);

app.use(
  "/follow",
  [middlewares.authenticated],
  user_follow_router.authProtected
);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

// app.use(
//   "/favorite/article",
//   [middlewares.authenticated],
//   user_favorites_router.authProtected
// );
