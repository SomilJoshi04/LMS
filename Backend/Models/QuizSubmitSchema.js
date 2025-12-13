const User = require("../Models/UserSchema");
const Quiz = require("../Models/QuizSchema");
const mongoose = require("mongoose");

const QuizSubmitSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
  },

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  answers: [String],

  score: {
    type: Number,
    default: 0,
  },

  submitedAt: {
    type: Date,
    default: Date.now(),
  },
});

const SubmitQuiz = mongoose.model("SubmitQuiz", QuizSubmitSchema);
module.exports = SubmitQuiz;
