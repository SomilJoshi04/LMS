const {
  enrollCourses,
  getAvailableCourses,
  addCourse,
  getMyCourses,
  getTeacherCourses,
  updateProgress,
} = require("../Controllers/CourseController");

const router = require("express").Router();

router.post("/addCourse", addCourse);
router.post("/enrollCourses", enrollCourses);
router.get("/myCourses/:userId", getMyCourses);
router.get("/availableCourses/:userId", getAvailableCourses);
router.get("/teacherCourses/:createdBy", getTeacherCourses);
router.post("/updateProgress", updateProgress);

module.exports = router;
