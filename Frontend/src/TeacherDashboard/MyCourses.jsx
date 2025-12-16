import React from "react";
import CourseCard from "../StudentDashboards/CourseCard";
import TeacherCourseCard from "./TeacherCourseCard.jsx";
import { FadeLoader } from "react-spinners";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

function MyCourses({ courses, loading, setActive }) {


  useGSAP(() => {
    gsap.from(".box h3", {
      opacity: 0,
      x: 200,
      duration: 0.8,
      delay: 0.6,
    });
  });

  return (
    <div className="box">
      {loading ? (
        <h3 className="heading">Loading Courses</h3>
      ) : courses.title ? (
        <h3 className="heading">Your Courses</h3>
      ) : (
        " "
      )}

      <div className="TeachercourseContainer">
        {loading ? (
          <div className="loader-wrapper">
            <FadeLoader />
          </div>
        ) : courses.length === 0 ? (
          <p className="heading">No courses created yet.</p>
        ) : (
          courses.map((course) => (
            <TeacherCourseCard
              key={course._id}
              thumbnail={course.thumbnail}
              title={course.title}
              description={course.description}
              price={course.price}
              enrollCount={course.enrollCount}
              loading={loading}
              setActive={setActive}
              courseId={course._id}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default MyCourses;
