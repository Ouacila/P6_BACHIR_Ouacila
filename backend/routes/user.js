const express = require("express");
const {
  body,
  validationResult
} = require('express-validator');
const router = express.Router();

const userCtrl = require("../controllers/user");

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