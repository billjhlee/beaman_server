const models = require("../models/index.js");

const authenticated = async (req, res, next) => {
  if (!req.user) {
    res.status(401).send("Unauthenticated");
  } else next();
};

const super_role = async (req, res, next) => {
  if (req.user.role !== "super") {
    res.status(401).send("Unauthorized");
  } else next();
};

const editor_role = async (req, res, next) => {
  // console.log(req.user.role);
  if (req.user.role !== "editor" && req.user.role !== "super") {
    res.status(401).send("Unauthorized");
  } else next();
};

const partner_role = async (req, res, next) => {
  if (req.user.role !== "partner") {
    res.status(401).send("Unauthorized");
  } else next();
};

const ownership = async (req, res, next) => {
  try {
    const object = await models[req.body.model].findOne({
      where: { id: req.body.id },
    });

    // req.body[req.body.model.toLowerCase() + "Id"] = req.body.id;
    // delete req.body.id;
    if (object.userId !== req.user.id) {
      res.status(401).send("Unauthorized");
    }
    next();
  } catch (e) {
    res.status(401).send("Unauthorized");
  }
};

module.exports = {
  super_role,
  editor_role,
  partner_role,
  ownership,
  authenticated,
};
