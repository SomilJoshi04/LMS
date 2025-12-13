const {
  addQuiz,
  getAllQuizzes,
  checkQuizAccess,
  getQuiz,
  QuizSubmit,
} = require("../Controllers/QuizController");

const router = require("express").Router();

router.post("/addQuiz", addQuiz);
router.post("/checkQuizAccess", checkQuizAccess);
router.get("/getAllQuizzes", getAllQuizzes);
router.get("/getQuiz/:quizId", getQuiz);

// for submit the quiz
router.post("/QuizSubmit", QuizSubmit);

module.exports = router;
