import { useState } from "react";
import "./StudentDashboard.css";
import StudentCourse from "./StudentCourses";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

function StudentProgressSection() {
  const [active, setActive] = useState("mycourses");
  const [myCourses, setMyCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);

  const location = useLocation();

  const { progress = 0 } = location.state || {};

  const courses = myCourses || [];

  // calculate total enrollcourses
  const totalCourses = courses.length;

  // calculate complete course
  const completedCourses = courses.filter((c) => c.completed === true).length;

  // calculate overallprogress
  let overallProgress = 0;

  if (totalCourses === 0) {
    overallProgress = 0;
  } else {
    const totalProgress = courses.reduce((sum, c) => sum + c.progress, 0);
    overallProgress = totalProgress / totalCourses;
  }

  // calcultate total time spent on watching ourses
  const totalTimeSpent = courses.reduce((sum, c) => sum + c.timeSpent, 0);

  // time converter function
  function formatTime(seconds) {
    if (!seconds) return "0 sec";

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) return `${hrs} hr ${mins} min`;
    if (mins > 0) return `${mins} min ${secs} sec`;
    return `${secs} sec`;
  }

  useGSAP(() => {
    gsap.from(".progressContainer h2 , .Overall-Progress , .courseNavbar", {
      y: -20,
      opacity: 0,
      duration: 0.8,
      delay: 0.5,
    });

    gsap.from(".progressContainer, .card", {
      x: 200,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      stagger: 0.2,
    });
  });

  return (
    <div className="dashboardSection">
      <div className="dashboard-Container">
        {/* Overall Stats */}
        <div className="progressContainer">
          <h2>Learning Progress</h2>
          <div className="progress-card">
            <div
              className="card"
              style={{ color: "#1E40AE", backgroundColor: "#EFF6FF" }}
            >
              <div className="card-div1">{totalCourses}</div>
              <div className="text1">Total Courses</div>
            </div>

            <div
              className="card"
              style={{ color: "#16A34A", backgroundColor: "#F0FDF4" }}
            >
              <div className="card-div1">{completedCourses}</div>
              <div className="text2">Completed</div>
            </div>

            <div
              className="card"
              style={{ color: "#CA8A40", backgroundColor: "#fcfaedff" }}
            >
              <div className="card-div1">{progress.toFixed(2) || "0"}%</div>
              <div className="text3">In Progress</div>
            </div>

            <div
              className="card"
              style={{ color: "#9333EA", backgroundColor: "#f1eef5ff" }}
            >
              <div className="card-div1">
                {formatTime(totalTimeSpent) || "0m"}
              </div>
              <div className="text4">Time Spent</div>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="Overall-Progress">
            <div className="progress-text">
              <span>Overall Progress</span>
              <span>{overallProgress.toFixed(2) || "0"}%</span>
            </div>

            <div className="progressBar">
              <div
                className="progressFill"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="courseNavbar">
        <button
          className={`${active == "mycourses" ? "active" : ""}`}
          onClick={() => setActive("mycourses")}
        >
          <span>
            My Courses ( {myCourses.filter((course) => course.courseId).length})
          </span>
        </button>

        <button
          className={`${active == "availablecourses" ? "active" : ""}`}
          onClick={() => setActive("availablecourses")}
        >
          <span>Availavle Courses ({availableCourses.length})</span>
        </button>

        <button
          className={`${active == "Quiz" ? "active" : ""}`}
          onClick={() => setActive("Quiz")}
        >
          <span>Quiz</span>
        </button>
      </div>
      <StudentCourse
        active={active}
        setActive={setActive}
        myCourses={myCourses}
        setMyCourses={setMyCourses}
        availableCourses={availableCourses}
        setAvailableCourses={setAvailableCourses}
      />
    </div>
  );
}

export default StudentProgressSection;
