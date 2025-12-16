const mongoose = require("mongoose");

const User = require("../Models/UserSchema");
const Course = require("../Models/CourseSchema.js");

// add Course

const addCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, createdBy, modules, price } =
      req.body;

    const existingCourse = await Course.findOne({ title: title.trim() });

    if (existingCourse) {
      return res.status(400).json({
        message: "Course is Already Added",
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(createdBy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid  user ID",
      });
    }

    const course = new Course({
      title,
      description,
      thumbnail,
      modules,
      createdBy,
      price,
    });

    await course.save();

    res.status(200).json({
      message: "Course Added Successfully",
      success: true,
      course,
    });
  } catch (err) {
    // console.error("Add course Error", err);

    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Enroll courses
const enrollCourses = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyEnroll = user.enrolledCourses.some(
      (c) => c.courseId === courseId
    );

    // if user already enroll course
    if (alreadyEnroll) {
      // it return enroll + updated course
      const populatedUser = await User.findById(userId).populate({
        path: "enrolledCourses.courseId",
        populate: {
          path: "createdBy",
          model: "User",
          select: "username",
        },
      });

      const enrolledIds = populatedUser.enrolledCourses
        .filter((c) => c.courseId !== null)
        .map((c) => c.courseId._id.toString());

      const availableCourses = await Course.find({
        _id: { $nin: enrolledIds },
      });

      return res.status(200).json({
        success: false,
        message: "Already enrolled in this course",
        myCourses: populatedUser.enrolledCourses,
        availableCourses,
      });
    }

    user.enrolledCourses.push({
      courseId,
      progress: 0,
      timeSpent: 0,
      completed: false,
    });

    await user.save();

    // return updated mycourses + available courses
    const populatedUser = await User.findById(userId).populate({
      path: "enrolledCourses.courseId",
      populate: {
        path: "createdBy",
        model: "User",
        select: "username",
      },
    });

    const updatepopulateUser = await Promise.all(
      populatedUser.enrolledCourses.map(async (courseObj) => {
        const enrollCount = await User.countDocuments({
          "enrolledCourses.courseId": courseObj.courseId._id,
        });

        return {
          ...courseObj.toObject(),
          enrollCount,
        };
      })
    );

    const enrolledIds = populatedUser.enrolledCourses
      .filter((c) => c.courseId !== null)
      .map((c) => c.courseId._id.toString());

    const availableCourses = await Course.find({
      _id: { $nin: enrolledIds },
    });

    res.status(200).json({
      success: true,
      message: "Course enrolled successfully!",
      // myCourses: populatedUser.enrolledCourses,
      myCourses: updatepopulateUser,
      availableCourses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMyCourses = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate({
      path: "enrolledCourses.courseId",
      populate: {
        path: "createdBy",
        model: "User",
        select: "username",
      },
    });

    const userCourses = user.enrolledCourses;

    const updateCourses = await Promise.all(
      userCourses.map(async (courseObj) => {
        if (!courseObj.courseId) {
          return { ...courseObj, enrollCount: 0 };
        }
        const courseId = courseObj.courseId._id;

        const enrollCount = await User.countDocuments({
          "enrolledCourses.courseId": courseId,
        });

        return {
          ...courseObj.toObject(),
          enrollCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      // myCourses: user.enrolledCourses,
      myCourses: updateCourses,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAvailableCourses = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    const enrollIds = user.enrolledCourses.map((c) => c.courseId);

    const availableCourses = await Course.find({
      _id: { $nin: enrollIds },
    }).populate("createdBy", "username");

    const updateCourses = await Promise.all(
      availableCourses.map(async (courseObj) => {
        const enrollCount = await User.countDocuments({
          "enrolledCourses.courseId": courseObj._id,
        });

        return {
          ...courseObj.toObject(),
          enrollCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      availableCourses: updateCourses,
      // availableCourses,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getTeacherCourses = async (req, res) => {
  try {
    const { createdBy } = req.params;

    const courses = await Course.aggregate([
      // 1. Match courses created by teacher
      {
        $match: { createdBy: new mongoose.Types.ObjectId(createdBy) },
      },

      // 2. Lookup enrolled students from User collection
      {
        $lookup: {
          from: "users",
          let: { courseId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    "$$courseId",
                    { $ifNull: ["$enrolledCourses.courseId", []] },
                  ],
                },
              },
            },
            {
              $project: {
                username: 1,
                email: 1,
                _id: 1,
              },
            },
          ],
          as: "enrollUser",
        },
      },

      // 3. Add enroll count
      {
        $addFields: {
          enrollCount: { $size: "$enrollUser" },
        },
      },

      // 4. Populate teacher basic info
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      { $unwind: "$createdBy" },

      // 5. Limit teacher fields
      {
        $project: {
          "createdBy.name": 1,
          "createdBy.email": 1,
          title: 1,
          name: 1,
          description: 1,
          thumbnail: 1,
          price: 1,
          enrollUser: 1,
          enrollCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      teacherCourses: courses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateProgress = async (req, res) => {
  const { userId, courseId, timeWatched, totalDuration } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
    });
  }

  const course = user.enrolledCourses.find(
    (c) => c.courseId.toString() === courseId
  );

  if (!course) {
    return res
      .status(404)
      .json({ message: "Course not Enroll", success: false });
  }

  const newProgress = Math.min((timeWatched / totalDuration) * 100, 100);
  course.progress = newProgress;
  course.timeSpent = timeWatched;
  course.completed = newProgress >= 98;

  await user.save();
  res.json({ success: true, course });
};

module.exports = {
  enrollCourses,
  getMyCourses,
  getAvailableCourses,
  addCourse,
  getTeacherCourses,
  updateProgress,
};
