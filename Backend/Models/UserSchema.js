const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  imgLink: { type: String, default: "" },
  role: { type: String, enum: ["student", "teacher", "admin"], required: true },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Phone number must be 10 digits"],
  },
  location: { type: String },
  gender: { type: String },
  Dob: { type: String },

  Qualification: {
    type: String,
    default: null,
  },
  Experience: {
    type: String,
    default: null,
  },

  skills: [String],
  Bio: { type: String },

  enrolledCourses: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      progress: { type: Number, default: 0 },
      timeSpent: { type: Number, default: 0 },
      completed: { type: Boolean, default: false },
    },
  ],
});

const UserSchema = mongoose.model("User", userSchema);
module.exports = UserSchema;
