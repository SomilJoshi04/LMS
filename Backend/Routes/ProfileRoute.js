const {
  userData,
  updateProfile,
} = require("../Controllers/ProfileController.js");

const router = require("express").Router();

router.get("/getprofile/:userId", userData);
router.put("/updateProfile/:userId", updateProfile);

module.exports = router;
