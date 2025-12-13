const {
  signupValidation,
  loginValidation,
} = require("../Middlewares/AuthValidations.js");

const { signup, login } = require("../Controllers/AuthControllers.js");

const router = require("express").Router();

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);

module.exports = router;
