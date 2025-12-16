import axios from "axios";
import "./courseCard.css";
import { useNavigate } from "react-router-dom";

function CourseCard({
  title,
  description,
  thumbnail,
  price,
  teacher,
  duration,
  type,
  videoUrl,
  courseId,
  setMyCourses,
  setAvailableCourses,
  setActive,
  completed,
  enrollCount,
}) {
  const userId = sessionStorage.getItem("userId");

  const navigate = useNavigate();

  const hanldeStartLearning = () => {
    navigate(`/watch/${courseId}`, {
      state: { videoUrl },
    });
  };

  const handleEnroll = async () => {
    try {
      const response = await axios.post(
        `https://lms-5-7p4k.onrender.com/course/enrollCourses`,
        {
          userId,
          courseId,
        }
      );

      //  const response = await axios.post(
      //   `http://localhost:4000/course/enrollCourses`,
      //   {
      //     userId,
      //     courseId,
      //   }
      // );
      
      if (response.data.success) {
        setMyCourses(response.data.myCourses);

        setAvailableCourses(response.data.availableCourses);
        setActive("mycourses");
        alert("Enrolled Successfully!");
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getHumanReadable = (hoursValue) => {
    if (!hoursValue) return "";
    const totalMinutes = Math.round(parseFloat(hoursValue) * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="cardContainer">
      <div className="cardimg ">
        <img src={thumbnail || "./media/cardimg1.jpg"} alt="hackcard" />
      </div>

      <div className="cardData-Container">
        <div
          className="Card-info"
          // onClick={handleRating}
          style={{ color: "black" }}
        >
          <p>⭐4.5</p>
        </div>

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
          <span priceSpan2>
            <i className="fa-solid fa-circle-user"></i>
            {enrollCount}
          </span>
        </div>

        {completed ? (
          <button className="courseCardbtn" onClick={hanldeStartLearning}>
            completed
          </button>
        ) : type === "available" ? (
          <button className="courseCardbtn" onClick={handleEnroll}>
            Enroll Now
          </button>
        ) : (
          <button className="courseCardbtn" onClick={hanldeStartLearning}>
            Start Learning
          </button>
        )}
      </div>
    </div>
  );
}

export default CourseCard;
