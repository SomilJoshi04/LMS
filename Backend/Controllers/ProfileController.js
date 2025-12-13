const User = require("../Models/UserSchema");

// get user data

const userData = async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({
        message: "User Data not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "userData fetched Successfully",
      success: true,
      userData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server Error",
      success: false,
    });
  }
};

//update profile
const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "failed to update Profile",
    });
  }
};

module.exports = {
  userData,
  updateProfile,
};
