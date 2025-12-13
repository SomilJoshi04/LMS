const User = require("../Models/UserSchema");
const Course = require("../Models/CourseSchema");
const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },

  description: {
    type: String,
  },

  quizCreatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  CourseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },

  timeLimit: {
    type: Number,
    default: null,
  },

  publishDate: {
    type: Date,
    default: Date.now,
  },

  questions: [
    {
      QuestionText: String,
      options: [String],
      correctAnswer: String,
      mark: {
        type: Number,
        default: null,
      },
    },
  ],
});

const Quiz = mongoose.model("Quiz", QuizSchema);
module.exports = Quiz;
