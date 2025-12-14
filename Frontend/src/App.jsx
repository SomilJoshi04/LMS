import StudentDashboard from "./StudentDashboards/StudentDashboard";
import Navbar from "./Component/Navbar";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import TeacherDashboard from "./TeacherDashboard/TeacherDashboard";
import StudentProgressSection from "./StudentDashboards/StudentProgressSection";
import Login from "./Authentication/Login";
import Signup from "./Authentication/Signup";

import { useEffect, useState } from "react";
import axios from "axios";
import { handleError } from "./utils";
import WatchCourses from "./StudentDashboards/WatchCourses";
import LoginRemainder from "./Authentication/LoginRemainder";
import { ToastContainer } from "react-toastify";
import QuizUI from "./StudentDashboards/QuizUI";
import QuizScore from "./StudentDashboards/QuizScore";
import ProfileForm from "./Component/ProfileForm";
import Profile from "./Component/Profile";
import AdminDashboard from "./AdminDashboard/AdminDashboard";

function App() {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/quiz/QuizScore";

  const hideLoginRemainder =
    location.pathname === "/login" || location.pathname === "/signup";

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          ` https://lms-5-7p4k.onrender.com/profile/getprofile/${userId}`
        );

        // const response = await axios.get(
        //   ` http://localhost:4000/profile/getprofile/${userId}`
        // );

        if (response.data.success) {
          setUserData(response.data.userData);
        } else {
          console.log("Profile not fetched", response.data.message);
        }
      } catch (err) {
        console.log(err);
        handleError(err);
      }
    };
    if (userId) {
      fetchData();
    }
  }, [userId]);
  return (
    <>
      {!hideLoginRemainder && <LoginRemainder />}
      {!hideNavbar && (
        <Navbar
          setUserData={setUserData}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}

      <Routes>
        <Route
          path="/login"
          element={
            <Login
              setUserData={setUserData}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/admin"
          element={
            isAuthenticated ? (
              <AdminDashboard userData={userData} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/"
          element={
            // isAuthenticated ? (
            <StudentDashboard userData={userData} />
            // ) : (
            //   <Navigate to="/login" />
            // )
          }
        />
        <Route
          path="/Teacher"
          element={
            isAuthenticated ? (
              <TeacherDashboard userData={userData} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/Profile"
          element={
            isAuthenticated ? (
              <Profile userData={userData} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/ProfileForm"
          element={
            isAuthenticated ? (
              <ProfileForm setUserData={setUserData} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/progress"
          element={
            isAuthenticated ? (
              <StudentProgressSection />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* <Route path="/progress" element={<StudentProgressSection />} /> */}

        <Route
          path="/watch/:courseId"
          element={
            isAuthenticated ? <WatchCourses /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/quiz/:quizId"
          element={isAuthenticated ? <QuizUI /> : <Navigate to="/login" />}
        />
        <Route
          path="/quiz/QuizScore"
          element={isAuthenticated ? <QuizScore /> : <Navigate to="/login" />}
        />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
