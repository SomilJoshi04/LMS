const User = require("../Models/UserSchema");

const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },

  description: {
    type: String,
  },

  thumbnail: {
    type: String,
    default: "",
  },

  price: {
    type: Number,
    default: 0,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  modules: [
    {
      title: String,
      content: String,
      videoUrl: String,
      duration: Number,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
