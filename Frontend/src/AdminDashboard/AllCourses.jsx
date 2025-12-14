import { useEffect, useState } from "react";
import AllCourseCard from "./AllCourseCard";
import axios from "axios";
import { handleError, handleSuccess } from "../utils";
import { FadeLoader } from "react-spinners";

function AllCourses({ active }) {
  const [courses, setCourses] = useState([]);
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchedAllCourses = async () => {
      try {
        const response = await axios.get(
          "https://lms-5-7p4k.onrender.com/admin/allCourses"
        );

        // const response = await axios.get(
        //   "http://localhost:4000/admin/allCourses"
        // );

        if (response.data.success) {
          handleSuccess(response.data.messaage);
          setIsLoading(false);
          setCourses(response.data.courses);
        } else {
          handleError(response.data.messaage);
        }
      } catch (err) {
        console.log(err);
        handleError(err.response.data?.messaage || "Something went wrong");
      }
    };
    fetchedAllCourses();
  }, []);
  return (
    <>
      {isloading && (
        <div className="loader-wrapper">
          <FadeLoader />
        </div>
      )}
      <div className="courseDetails">
        {active === "availableCourses" &&
          courses.map((course) => (
            <div className="course-card-item" key={course._id}>
              <AllCourseCard
                title={course.title}
                description={course.description}
                thumbnail={course.thumbnail}
                price={course.price}
                teacher={course.createdBy?.username || "Unknown Teacher"}
                duration={
                  course.modules?.length
                    ? course.modules[0].duration + " min"
                    : "N/A"
                }
                courseId={course?._id}
                setCourses={setCourses}
              />
            </div>
          ))}
      </div>
    </>
  );
}

export default AllCourses;
