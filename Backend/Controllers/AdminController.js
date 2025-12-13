const mongoose = require("mongoose");

const User = require("../Models/UserSchema");
const Course = require("../Models/CourseSchema.js");

// for admin we get all courses
const allCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    if (!courses) {
      return res.status(404).json({
        message: "Courses not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Courses fetched Successfully",
      success: true,
      courses,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json({
      message: "users fetched Successfully",
      success: true,
      allUsers,
    });
  } catch (err) {
    res.status(500).json({
      message: err.mess,
      success: false,
    });
  }
};

const allDelete = async (req, res) => {
  try {
    const { userId } = req.params;
    const deleteUser = await User.findByIdAndDelete(userId);

    if (!deleteUser) {
      return res.status(404).json({
        message: "User not deleted",
        success: false,
      });
    }

    res.status(200).json({
      message: "user deleted Successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const deleteCourses = async (req, res) => {
  try {
    const { courseId } = req.params;
    const deleteCourse = await Course.findByIdAndDelete(courseId);

    if (!deleteCourse) {
      return res.status(404).json({
        message: "Course not delete",
        success: false,
      });
    }

    res.status(200).json({
      message: "Course delete Successfully",
      success: true,
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  allCourses,
  getAllUsers,
  allDelete,
  deleteCourses,
};
