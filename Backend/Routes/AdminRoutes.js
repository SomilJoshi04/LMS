const {
  allCourses,
  getAllUsers,
  allDelete,
  deleteCourses,
} = require("../Controllers/AdminController");

const router = require("express").Router();

router.get("/allCourses", allCourses);
router.get("/allUsers", getAllUsers);
router.delete("/delete/:userId", allDelete);
router.delete("/deleteCourse/:courseId", deleteCourses);

module.exports = router;
