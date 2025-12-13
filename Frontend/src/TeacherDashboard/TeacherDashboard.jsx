import React, { useState, useEffect } from "react";
import MyCourses from "./MyCourses";
import AddCourse from "./AddCourse";
import Students from "./Students";
import "./TeacherDashboard.css";
import axios from "axios";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import AddQuizzes from "./AddQuizzes";

function TeacherDashboard({ userData }) {
  const [active, setActive] = useState("mycourses");
  const [courses, setCourses] = useState([]);
  const [loading, setIsLoading] = useState(true);

  const userId = localStorage.getItem("userId");
  useEffect(() => {
    const teacherCourses = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://lms-5-7p4k.onrender.com/course/teacherCourses/${userId}`
        );

        if (response.data.success) {
          return setCourses(response.data.teacherCourses);
        } else {
          console.log(response.data.message);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false); // stop loading
      }
    };

    if (userId) {
      teacherCourses();
    }
  }, [userId]);

  useGSAP(() => {
    gsap.from(".teacherDashboard h2", {
      opacity: 0,
      x: -200,
      duration: 0.8,
      delay: 0.6,
    });

    gsap.from(".courseNavbar button", {
      y: -100,
      opacity: 0,
      duration: 0.7,
      delay: 0.5,
      stagger: 0.16,
    });
  });

  return (
    <div className="teacherDashboard">
      <h2>Welcome {userData?.username}</h2>

      <div className="courseNavbar">
        <button
          className={`${active == "mycourses" ? "active" : ""}`}
          onClick={() => setActive("mycourses")}
        >
          My Courses
        </button>
        <button
          className={`${active == "addcourse" ? "active" : ""}`}
          onClick={() => setActive("addcourse")}
        >
          Add New Course
        </button>

        {/* <button
          className={`${active == "addQuiz" ? "active" : ""}`}
          onClick={() => setActive("addQuiz")}
        >
          Add Quiz
        </button> */}

        <button
          className={`${active == "students" ? "active" : ""}`}
          onClick={() => setActive("students")}
        >
          Enrolled Students
        </button>
      </div>

      {active === "mycourses" && (
        <MyCourses
          courses={courses}
          loading={loading}
       
          setActive={setActive}
        />
      )}
      {active === "addcourse" && <AddCourse />}
      {active === "students" && <Students courses={courses} />}

      {active === "addQuiz" && <AddQuizzes />}
    </div>
  );
}

export default TeacherDashboard;
