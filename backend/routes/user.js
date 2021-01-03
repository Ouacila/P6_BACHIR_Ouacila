const express = require("express");
const { body } = require("express-validator");

const userCtrl = require("../controllers/user");

const router = express.Router();

router.post(
  "/signup",
  body("email").isEmail(),
  body("password").isLength({
    min: 8,
  }),
  userCtrl.signup
);
router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({
    min: 8,
  }),
  userCtrl.login
);

module.exports = router;
