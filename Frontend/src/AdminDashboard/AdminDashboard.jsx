import { useEffect, useState } from "react";
import AddCourse from "../TeacherDashboard/AddCourse";
import AllUsers from "./AllUsers";

import axios from "axios";
import { handleError, handleSuccess } from "../utils";
import AllCourses from "./AllCourses";
function AdminDashboard({ userData }) {
  const [active, setActive] = useState("availableCourses");


  const [allUsers, setAllUsers] = useState([]);

 

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          "https://lms-5-7p4k.onrender.com/admin/allUsers"
        );
        if (response.data.success) {
          handleSuccess(response.data.message);
          setAllUsers(response.data.allUsers);
        } else {
          handleError(response.data.message);
        }
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <div className="adminDashboard">
      <h2 style={{ textAlign: "center", marginTop: "1.5vw" }}>
        Welcome {userData?.username}
      </h2>

      <div className="courseNavbar">
        <button
          className={`${active == "availableCourses" ? "active" : ""}`}
          onClick={() => setActive("availableCourses")}
        >
          Total Courses
        </button>

        <button
          className={`${active == "addcourse" ? "active" : ""}`}
          onClick={() => setActive("addcourse")}
        >
          Add New Course
        </button>

        <button
          className={`${active == "Teachers" ? "active" : ""}`}
          onClick={() => setActive("Teachers")}
        >
          All Teachers
        </button>

        <button
          className={`${active == "students" ? "active" : ""}`}
          onClick={() => setActive("students")}
        >
          All Students
        </button>
      </div>

      {active === "availableCourses" && (
        <AllCourses active={active} />
      )}
      {active === "addcourse" && <AddCourse />}
      {active === "students" && (
        <AllUsers
          allUsers={allUsers}
          active={active}
          setAllUsers={setAllUsers}
        />
      )}
      {active === "Teachers" && (
        <AllUsers
          allUsers={allUsers}
          active={active}
          setAllUsers={setAllUsers}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
