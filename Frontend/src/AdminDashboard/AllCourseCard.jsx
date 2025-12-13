import axios from "axios";
import { handleError, handleSuccess } from "../utils";

function AllCourseCard({
  title,
  thumbnail,
  description,
  price,
  teacher,
  duration,
  courseId,
  setCourses,
}) {
  const getHumanReadable = (hoursValue) => {
    if (!hoursValue) return "";
    const totalMinutes = Math.round(parseFloat(hoursValue) * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
  };

  const handleCoursedelete = async (courseId) => {
    try {
      const response = await axios.delete(
        `https://lms-5-7p4k.onrender.com/admin/deleteCourse/${courseId}`
      );

      if (response.data.success) {
        handleSuccess(response.data.message);
        setCourses((prevCourse) => prevCourse.filter((c) => c._id != courseId));
      } else {
        handleError(response.data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="cardContainer">
      <div className="cardimg ">
        <img src={thumbnail || "./media/cardimg1.jpg"} alt="hackcard" />
      </div>

      <div className="cardData-Container">
        {/* <div
          className="Card-info"
          // onClick={handleRating}
          style={{ color: "black" }}
        >
          <p>⭐4.5</p>
        </div> */}
        <h3 className="cardtitle">{title}</h3>
        <p className="cardtext">{description}</p>
        <div className="Teachername">
          <span>By {teacher}</span>
          <span>{getHumanReadable(duration)}</span>
        </div>
        <div className="cardPrice">
          <span className="priceSpan1">
            <i className="fa-solid fa-indian-rupee-sign"></i>
            {price}
          </span>
          {/* <span priceSpan2>
            <i className="fa-solid fa-circle-user"></i>
            {enrollCount}
          </span> */}
        </div>
        <button
          className="courseCardbtn"
          onClick={() => handleCoursedelete(courseId)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default AllCourseCard;
