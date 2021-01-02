const authGuard = require("./auth");
const {
  super_role,
  editor_role,
  partner_role,
  ownership,
  authenticated
} = require("./rights");

module.exports = {
  authGuard,
  super_role,
  editor_role,
  partner_role,
  ownership,
  authenticated
};
