var admin = require("firebase-admin");

var serviceAccount =
  process.env.NODE_ENV === "production"
    ? require("./serviceAccountKey.json")
    : require("./serviceAccountKeyDev.json");

var app =
  process.env.NODE_ENV === "production"
    ? admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://beerman1-85f3e.firebaseio.com",
      })
    : admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://beerman-dev.firebaseio.com",
      });

let verifyIdToken = async function (token) {
  try {
    let res = await admin.auth().verifyIdToken(token);
    return res;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { admin, app, verifyIdToken };
