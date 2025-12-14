import { useState } from "react";
import { FadeLoader } from "react-spinners";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./Profile.css";
import { handleError, handleSuccess } from "../utils";
function Profile({ userData }) {
  const [settingbtn, setSettingBtn] = useState(false);

  const navigate = useNavigate();

  useGSAP(() => {
    if (userData?._id) {
      gsap.from(".studentProfile", {
        x: -300,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
      });

      gsap.from(".profileimg", {
        x: -300,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        stagger: 0.16,
      });

      gsap.from(".profiletext", {
        x: 300,
        opacity: 0,
        duration: 0.8,
        delay: 0.7,
      });

      gsap.from(".profileSections > div", {
        x: 50,
        opacity: 0,
        duration: 0.7,
        delay: 0.9,
        stagger: 0.2,
        ease: "power2.out",
      });

      gsap.from(".settingWrapper", {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        delay: 0.9,
      });
    }
  }, [userData?._id]);

  if (!userData?._id)
    return (
      <div className="loader-wrapper">
        <FadeLoader />
      </div>
    );

  const handlebtnUpdate = () => {
    navigate("/ProfileForm");
  };

  const handleDelete = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.delete(
        `https://lms-5-7p4k.onrender.com/auth/delete/${userId}`
      );

      //  const response = await axios.delete(
      //   `http://localhost:4000/auth/delete/${userId}`
      // );


      if (response.data.success) {
        handleSuccess(response.data.message);
        localStorage.clear();
        navigate("/");
      } else {
        handleError(response.data.message);
      }
    } catch (err) {
      console.error(err);
      handleError(err.message);
    }
  };

  return (
    <div className="studentProfile">
      <div className="profilediv1"></div>

      <div className="profileimg">
        <img
          src={userData?.imgLink || "/media/Useravatar.png"}
          alt="profileimg"
        />
      </div>

      <div className="profiletext">
        <h1>{userData?.username}</h1>
        <p>{userData?.email}</p>
      </div>
      <div className="settingContainer"></div>
      <div className="settingWrapper">
        <i
          className="fa-solid fa-gear icon"
          onClick={() => setSettingBtn(!settingbtn)}
        ></i>
        {settingbtn == true && (
          <div className="settingDropdown">
            <button onClick={handlebtnUpdate}>Update Profile Info</button>
            {/* <button>Change Password</button>
            <button>Change Profile Picture</button> */}
            <button className="danger" onClick={handleDelete}>
              Delete Account
            </button>
          </div>
        )}
      </div>
      {userData?.role == "admin" ? (
        <div className="TeacherAbout" id="profileInfo1">
          <div className="TeacherAbout-1">
            <h2>
              About me
              <i
                className="fa-solid fa-calendar icon"
                style={{ color: "rgba(109, 162, 236, 1)", fontSize: "18px" }}
              ></i>
            </h2>

            <p>{userData?.Bio || "Admin About Section"}</p>
          </div>

          <div className="TeacherAbout-2">
            <ul>
              <li>
                <b>Phone:</b>
                {userData?.phone || "Phone number not added"}
              </li>
              <li>
                <b>Qualification:</b>
                {userData?.Qualification || "Qualification not added"}
              </li>
              <li>
                <b>Gender:</b>
                {userData?.gender || "Gender not added"}
              </li>
              <li>
                <b>DOB:</b>
                {userData?.Dob || "DOB not added"}
              </li>

              {/* <li>
                <b>Experience:</b>
                {userData?.Experience || "Experience not added"}
              </li>

              <li>
                <b>skills:</b>
                {userData?.skills || "skills not added"}
              </li> */}
            </ul>
          </div>
        </div>
      ) : userData?.role == "student" ? (
        <div className="profileSections">
          <div className="activitySection" id="profileInfo1">
            <h2>
              Recent Activity
              <i
                className="fa-solid fa-thumbtack icon"
                style={{ color: "rgba(237, 132, 132, 1)", fontSize: "18px" }}
              ></i>
            </h2>
            <ul>
              <li>Completed Module 2</li>
              <li>Scored 9/10 in Java Quiz</li>
              <li>Uploaded Assignment 1</li>
            </ul>
          </div>

          <div className="notificationSection" id="profileInfo1">
            <h2>
              Notifications
              <i
                className="fa-solid fa-bell icon"
                style={{ color: "gold", fontSize: "18px" }}
              ></i>
            </h2>
            <ul>
              <li>New course chapter available</li>
              <li>Your mentor added feedback</li>
            </ul>
          </div>

          <div className="AboutMe" id="profileInfo1">
            <h2>
              About me
              <i
                className="fa-solid fa-calendar icon"
                style={{ color: "rgba(109, 162, 236, 1)", fontSize: "18px" }}
              ></i>
            </h2>
            <ul>
              <li>
                <b>Phone:</b>
                {userData?.phone || "Phone number not added"}
              </li>
              <li>
                <b>Location:</b>
                {userData?.location || "location not added"}
              </li>
              <li>
                <b>Gender:</b>
                {userData?.gender || "Gender not added"}
              </li>
              <li>
                <b>DOB:</b>
                {userData?.Dob || "DOB not added"}
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="TeacherAbout" id="profileInfo1">
          <div className="TeacherAbout-1">
            <h2>
              About me
              <i
                className="fa-solid fa-calendar icon"
                style={{ color: "rgba(109, 162, 236, 1)", fontSize: "18px" }}
              ></i>
            </h2>

            <p>{userData?.Bio || "Teacher About Section"}</p>
          </div>

          <div className="TeacherAbout-2">
            <ul>
              <li>
                <b>Phone:</b>
                {userData?.phone || "Phone number not added"}
              </li>
              <li>
                <b>Qualification:</b>
                {userData?.Qualification || "Qualification not added"}
              </li>
              <li>
                <b>Gender:</b>
                {userData?.gender || "Gender not added"}
              </li>
              <li>
                <b>DOB:</b>
                {userData?.Dob || "DOB not added"}
              </li>

              <li>
                <b>Experience:</b>
                {userData?.Experience || "Experience not added"}
              </li>

              <li>
                <b>skills:</b>
                {userData?.skills || "skills not added"}
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
