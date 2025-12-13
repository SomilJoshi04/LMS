import { useState } from "react";
import axios from "axios";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

import "./ProfileForm.css";

function ProfileForm({ setUserData }) {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    imgLink: "",
    email: "",
    phone: "",
    location: "",
    gender: "",
    Dob: "",
    Bio: "",
    Qualification: "",
    skills: [""],
    Experience: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });

    // For array fields, split by comma
    // if (["skills"].includes(name)) {
    //   setProfile({ ...profile, [name]: value.split(",").map((item) => item.trim()) });
    // } else {
    //   setProfile({ ...profile, [name]: value });
    // }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    const updateData = {
      imgLink: profile.imgLink,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      gender: profile.gender,
      Dob: profile.Dob,
      Bio: profile.Bio,
      Qualification: profile.Qualification,
      skills: profile.skills,
      Experience: profile.Experience,
    };

    try {
      const response = await axios.put(
        `https://lms-5-7p4k.onrender.com/profile/updateProfile/${userId}`,
        updateData
      );

      if (response.data.success) {
        handleSuccess(response.data.message);
        setUserData(response.data.updatedUser);
        navigate("/Profile");
      } else {
        handleError(response.data.message);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      handleError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="Profileform">
      <h1>Profile</h1>
      <div className="formContainer">
        {profile.role == "teacher" ? (
          <form className="profileform" onSubmit={handleSubmit}>
            <h6>Image Link</h6>
            <input
              type="text"
              name="imgLink"
              value={profile.imgLink}
              onChange={handleChange}
              placeholder="Enter image URL"
            />

            <h6>Email</h6>
            <input
              type="text"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Enter your Email"
            />

            <h6>Phone</h6>
            <input
              type="number"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Enter your Phone number"
            />

            <h6>Location</h6>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              placeholder="Enter your Location"
            />

            <h6>Gender</h6>
            <input
              type="text"
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              placeholder="Enter your Gender"
            />

            <h6>Date of Birth</h6>
            <input
              type="date"
              name="Dob"
              value={profile.Dob}
              onChange={handleChange}
            />

            <h6>Bio</h6>
            <textarea
              name="Bio"
              value={profile.Bio}
              onChange={handleChange}
              placeholder="Enter something about you"
            ></textarea>

            <h6>Qualification</h6>
            <input
              type="text"
              name="Qualification"
              value={profile.Qualification}
              onChange={handleChange}
              placeholder="Enter your Qualification"
            />

            <h6>Skills</h6>
            <input
              type="text"
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              placeholder="React, Node, JavaScript"
            />

            <h6>Experience</h6>
            <input
              type="text"
              name="Experience"
              value={profile.Experience}
              onChange={handleChange}
              placeholder="Enter your Experience Level"
            />
            <button type="submit">Submit</button>
          </form>
        ) : (
          <form className="profileform" onSubmit={handleSubmit}>
            <h6>Image Link</h6>
            <input
              type="text"
              name="imgLink"
              value={profile.imgLink}
              onChange={handleChange}
              placeholder="Enter image URL"
            />

            <h6>Email</h6>
            <input
              type="text"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Enter your Email"
            />

            <h6>Phone</h6>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Enter your Phone number"
            />

            <h6>Location</h6>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              placeholder="Enter your Location"
            />

            <h6>Gender</h6>
            <input
              type="text"
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              placeholder="Enter your Gender"
            />

            <h6>Date of Birth</h6>
            <input
              type="date"
              name="Dob"
              value={profile.Dob}
              onChange={handleChange}
            />

            {/* <h6>Bio</h6>
            <textarea
              name="Bio"
              value={profile.Bio}
              onChange={handleChange}
              placeholder="Enter something about you"
            ></textarea> */}

            <button type="submit">Submit</button>
          </form>
        )}
        <ToastContainer />
      </div>
    </div>
  );
}

export default ProfileForm;
