import StudentProgressSection from "./StudentProgressSection.jsx";
import "./StudentDashboard.css";
import Video from "../BackgroundVideos/Video.jsx";
import { useNavigate } from "react-router-dom";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

function StudentDashboard({ userData }) {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    navigate("/progress");
  };

  const handleteacher = async () => {
    navigate("/Teacher");
  };

  const handleadmin = () => {
    navigate("/admin");
  };

  // const handlelogin = async () => {
  //   navigate("/login");
  // };

  // if (!userData?._id) {
  //   return (
  //     <>
  //       <Video />
  //       <div className="hero">
  //         <h1>Please login to use this feature</h1>
  //         <button className="dashboardbtn" onClick={handlelogin}>
  //           Login
  //         </button>
  //       </div>
  //     </>
  //   );
  // }

  useGSAP(
    () => {
      if (userData?._id) {
        gsap.from(".hero h1 , .hero p , .hero button", {
          y: 200,
          opacity: 0,
          duration: 0.5,
          delay: 0.6,
          stagger: 0.19,
          ease: "power2.out",
        });
      }
    },
    { dependencies: [userData?._id] }
  );

  return (
    <>
      <Video />
      <div className="heroContainer">
        <div className="hero">
          {userData?.role === "student" && (
            <>
              <h1>Welcome {userData?.username}</h1>
              <p>Continue your learning journey and explore new courses.</p>
              <button className="dashboardbtn" onClick={handleSubmit}>
                See your Progress
              </button>
            </>
          )}

          {userData?.role === "teacher" && (
            <>
              <h1>Welcome {userData?.username}</h1>
              <p>Access your teaching tools and course controls.</p>
              <button className="dashboardbtn" onClick={handleteacher}>
                Open Teacher Dashboard
              </button>
            </>
          )}

          {userData?.role === "admin" && (
            <>
              <h1>Welcome {userData?.username}</h1>
              <p>You can manage all users, courses, and quizzes here.</p>
              <button className="dashboardbtn" onClick={handleadmin}>
                Open Admin Dashboard
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
