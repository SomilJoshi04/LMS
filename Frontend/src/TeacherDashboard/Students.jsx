import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import "./TeacherDashboard.css";

function Students({ courses }) {
  const tableRef = useRef(null);

  useGSAP(() => {
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
  });

  return (
    <div className="enrolledStudent">
      {courses?.length === 0 ? (
        <div className="noStudent"> No Student Enrolled Yet</div>
      ) : (
        <>
          <h2 id="h2">All Courses and Enrolled Students</h2>
          <div className="table-wrapper">
            <table className="students-table" ref={tableRef}>
              <thead style={{ backgroundColor: "#f0f0f0" }}>
                <tr>
                  <th>#</th>
                  <th>Course Name</th>
                  <th>Student Name</th>
                  <th>Student Emails</th>
                </tr>
              </thead>

              <tbody>
                {courses.map((course, courseIndex) => {
                  const { enrollUser = [], title } = course;

                  // If no students, show a single row with course title and empty student
                  if (enrollUser.length === 0) {
                    return (
                      <tr key={course._id}>
                        <td>{courseIndex + 1}</td>
                        <td>{title}</td>
                        <td colSpan="2">No students enrolled</td>
                      </tr>
                    );
                  }

                  // If students exist, create a row per student
                  return enrollUser.map((user, userIndex) => (
                    <tr key={user._id}>
                      {userIndex === 0 && (
                        <>
                          <td rowSpan={enrollUser.length}>{courseIndex + 1}</td>
                          <td rowSpan={enrollUser.length}>{title}</td>
                        </>
                      )}
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Students;
