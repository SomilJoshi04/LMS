const User = require("../Models/UserSchema");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const signup = async (req, res) => {
  try {
    const { email, username, password, role, phone } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User is Already exist, you go for Login",
        success: false,
      });
    }

    const user = new User({ email, username, password, role, phone });
    user.password = await bcrypt.hash(password, 12);
    await user.save();

    res.status(201).json({
      message: "User SignupSuccessfully",
      success: true,
      userId: user._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(403).json({
        message: "User not found",
        success: false,
      });
    }

    const isPassEqual = await bcrypt.compare(password, existingUser.password);

    if (!isPassEqual) {
      return res.status(403).json({
        message: "Wrong Password,Please try again",
        success: false,
      });
    }

    const jwtToken = jwt.sign(
      {
        email: existingUser.email,
        _id: existingUser._id,
        role: existingUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "48h" }
    );

    const user = await User.findById(existingUser._id).select("-password");

    if (role != existingUser.role) {
      return res.status(403).json({
        message: "Please select a valid role",
        success: false,
      });
    }

    res.status(200).json({
      message: "Login Successfully",
      success: true,
      jwtToken,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const deletedUser = async (req, res) => {
  const { userId } = req.params;
  const userDelete = await User.findByIdAndDelete(userId);

  if (!userDelete) {
    return res.status(400).json({
      message: "Account not Deleted",
      success: false,
    });
  }

  res.status(200).json({
    message: "Account Deleted Successfully",
    success: true,
  });
};

module.exports = {
  signup,
  login,
  deletedUser,
};
