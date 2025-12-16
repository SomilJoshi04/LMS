import { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import axios from "axios";
import "./studentCourse.css";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { FadeLoader } from "react-spinners";
import QuizCard from "./QuizCard";

function StudentMyCourse({
  active,
  setActive,
  myCourses,
  setMyCourses,
  availableCourses,
  setAvailableCourses,
}) {
  const userId = sessionStorage.getItem("userId");

  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [mycourses, availablecourses] = await Promise.all([
          axios.get(
            `https://lms-5-7p4k.onrender.com/course/myCourses/${userId}`
          ),
          axios.get(
            `https://lms-5-7p4k.onrender.com/course/availableCourses/${userId}`
          ),
        ]);

        // const [mycourses, availablecourses] = await Promise.all([
        //   axios.get(
        //     `http://localhost:4000/course/myCourses/${userId}`
        //   ),
        //   axios.get(
        //     `http://localhost:4000/course/availableCourses/${userId}`
        //   ),
        // ]);

        if (mycourses.data.success) {
          setMyCourses(mycourses.data.myCourses);
        }

        if (availablecourses.data.success) {
          setAvailableCourses(availablecourses.data.availableCourses);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  useGSAP(() => {
    if (!isloading) {
      gsap.from(".course-card-item", {
        x: -500,
        opacity: 0,
        duration: 0.7,
        stagger: 0.16,
        ease: "power2.out",
      });
    }
  }, [isloading]);

  return (
    <>
      {isloading && (
        <div className="loader-wrapper">
          <FadeLoader />
        </div>
      )}

      <div className="courseDetails">
        {active === "mycourses" && (
          <>
            {!isloading && myCourses.length === 0 && (
              <div className="NoEnroll">
                <div className="Icon">📚</div>
                <h3>No enrolled courses yet</h3>
                <p>Browse available courses and start your learning journey!</p>
                <button onClick={() => setActive("availablecourses")}>
                  Browse Courses
                </button>
              </div>
            )}

            {!isloading &&
              myCourses.length > 0 &&
              myCourses.map((course) =>
                course.courseId ? (
                  <div className="course-card-item" key={course._id}>
                    <CourseCard
                      title={course.courseId.title}
                      description={course.courseId.description}
                      thumbnail={course.courseId.thumbnail}
                      price={course.courseId.price || 0}
                      teacher={
                        course.courseId.createdBy?.username || "Unknown Teacher"
                      }
                      duration={
                        course.courseId.modules?.length
                          ? course.courseId.modules[0].duration + " min"
                          : "N/A"
                      }
                      videoUrl={
                        course.courseId.modules?.length
                          ? course.courseId.modules[0].videoUrl
                          : "N/A"
                      }
                      courseId={course.courseId._id}
                      type="mycourses"
                      setMyCourses={setMyCourses}
                      setAvailableCourses={setAvailableCourses}
                      setActive={setActive}
                      completed={course.completed}
                      enrollCount={course.enrollCount}
                    />
                  </div>
                ) : null
              )}
          </>
        )}

        {active === "availablecourses" &&
          availableCourses.map((course) => (
            <div className="course-card-item" key={course._id}>
              <CourseCard
                title={course.title}
                description={course.description}
                thumbnail={course.thumbnail}
                price={course.price}
                // rating ={course.ratings}
                teacher={course.createdBy?.username || "Unknown Teacher"}
                duration={
                  course.modules?.length
                    ? course.modules[0].duration + " min"
                    : "N/A"
                }
                courseId={course._id}
                type="available"
                setMyCourses={setMyCourses}
                setAvailableCourses={setAvailableCourses}
                setActive={setActive}
                completed={course.completed}
                enrollCount={course.enrollCount}
              />
            </div>
          ))}

        {active === "Quiz" && <QuizCard />}
      </div>
    </>
  );
}
export default StudentMyCourse;
