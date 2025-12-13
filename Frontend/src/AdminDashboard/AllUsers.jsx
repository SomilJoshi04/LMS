import axios from "axios";
import { gsap } from "gsap";
// import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";
import { handleError, handleSuccess } from "../utils";

function AllUsers({ allUsers, active, setAllUsers }) {
  const tableRef = useRef(null);

  const teachers = allUsers.filter((u) => u.role === "teacher");
  const students = allUsers.filter((u) => u.role === "student");

  useEffect(() => {
    if (!tableRef.current) return;
    const rows = tableRef.current.querySelectorAll("tbody tr");
    gsap.from(rows, {
      x: -400,
      opacity: 0,
      duration: 0.8,
      delay: 0.6,
      stagger: 0.17,
    });

    gsap.from(".enrolledStudent", {
      x: -400,
      opacity: 0,
      duration: 0.8,
      delay: 0.5,
    });
  }, [students]);

  const handleDelete = async (userId) => {
    try {
      // const userId = user;
      console.log(userId);
      const response = await axios.delete(
        `https://lms-5-7p4k.onrender.com/admin/delete/${userId}`
      );

      if (response.data.success) {
        handleSuccess(response.data.message);
        setAllUsers((prevUsers) => prevUsers.filter((u) => u._id !== userId));
      } else {
        handleError(response.data.message);
      }
    } catch (err) {
      handleError(err.message);
    }
  };

  return (
    <div className="enrolledStudent">
      {active === "Teachers" ? (
        teachers.length === 0 ? (
          <div className="noStudent">No Teacher here</div>
        ) : (
          <>
            <h2>ALL Teachers</h2>
            <div className="table-wrapper">
              <table className="students-table">
                <thead style={{ backgroundColor: "#f0f0f0" }}>
                  <tr>
                    <th>#</th>
                    <th>Teacher Name</th>
                    <th>Teacher Email</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {teachers.map((teacher, index) => (
                    <tr key={teacher._id}>
                      <td>{index + 1}</td>
                      <td>{teacher.username}</td>
                      <td>{teacher.email}</td>
                      <td>
                        <button
                          style={{ border: "1px solid transparent" }}
                          onClick={() => handleDelete(teacher._id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )
      ) : students.length === 0 ? (
        <div className="noStudent">No Student here</div>
      ) : (
        <>
          <h2>ALL Students</h2>
          <div className="table-wrapper">
            <table className="students-table">
              <thead style={{ backgroundColor: "#f0f0f0" }}>
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Student Email</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {students.map((student, index) => (
                  <tr key={student._id}>
                    <td>{index + 1}</td>
                    <td>{student.username}</td>
                    <td>{student.email}</td>
                    <td>
                      <button
                        style={{ border: "1px solid transparent" }}
                        onClick={() => handleDelete(student._id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default AllUsers;
