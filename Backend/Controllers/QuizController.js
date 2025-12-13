const mongoose = require("mongoose");
const User = require("../Models/UserSchema");
const Quiz = require("../Models/QuizSchema");
const SubmitQuiz = require("../Models/QuizSubmitSchema");

const addQuiz = async (req, res) => {
  try {
    const {
      title,
      description,
      timeLimit,
      quizCreatedBy,
      CourseId,
      questions,
    } = req.body;

    const existingQuiz = await Quiz.findOne({ title: title.trim() });

    if (existingQuiz) {
      return res.status(400).json({
        message: "Quiz is Already Added",
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(quizCreatedBy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid  user ID",
      });
    }

    const quiz = new Quiz({
      title,
      description,
      timeLimit,
      quizCreatedBy,
      CourseId,
      questions,
    });

    await quiz.save();

    res.status(200).json({
      message: "Quiz Added Successfully",
      success: true,
      quiz,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("CourseId", "title");
    res.status(200).json({
      message: "Quiz fetched Successfull",
      success: true,
      quizzes,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch Quizzes",
      success: false,
    });
  }
};

const checkQuizAccess = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    const isEnrolled = user.enrolledCourses.some(
      (course) => course.courseId.toString() === courseId
    );

    if (!isEnrolled) {
      return res.status(400).json({
        message: "You are not Enrolled in this course",
        success: false,
      });
    }

    const quizzes = await Quiz.find({ CourseId: courseId });

    res.status(200).json({
      message: "Quiz fetched Successfully",
      success: true,
      quizzes,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went Wrong",
      success: false,
    });
  }
};

const getQuiz = async (req, res) => {
  const { quizId } = req.params;

  if (!quizId) {
    return res.status(400).json({
      message: "Quiz Id required",
      success: false,
    });
  }

  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    return res.status(400).json({
      message: "Invalid Quiz ID",
      success: false,
    });
  }

  try {
    const quiz = await Quiz.findById(quizId).populate("CourseId");

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "Quiz Fetched Successfully",
      success: true,
      quiz,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      success: false,
      error: err.message,
    });
  }
};

// for submit quiz

const QuizSubmit = async (req, res) => {
  try {
    const { quizId, studentId, answers, score } = req.body;

    if (!studentId) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    if (!quizId) {
      return res.status(400).json({
        message: "Quiz not found",
        success: false,
      });
    }

    // const student = await User.findById(studentId);
    const studentQuiz = await Quiz.findById(quizId);

    let totalScore = 0;

    for (let i = 0; i < answers.length; i++) {
      studentAnswer = answers[i].trim().toLowerCase();
      correctAnswer = studentQuiz.questions[i].correctAnswer
        .trim()
        .toLowerCase();
      if (studentAnswer === correctAnswer) {
        totalScore += studentQuiz.questions[i].mark;
      }
    }

    const studentQuizSubmit = new SubmitQuiz({
      quizId,
      studentId,
      answers,
      score: totalScore,
    });

    await studentQuizSubmit.save();

    res.status(200).json({
      message: "Quiz Submitted Successfully",
      success: true,
      studentQuizSubmit,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to Submit Quiz",
      success: false,
      error: err.message,
    });
  }
};

module.exports = {
  addQuiz,
  checkQuizAccess,
  getAllQuizzes,
  getQuiz,
  QuizSubmit,
};
