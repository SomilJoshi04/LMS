// import { useNavigate } from "react-router-dom";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

function TeacherCourseCard({
  thumbnail,
  title,
  description,
  price,
  enrollCount,
  loading,
  setActive,
  courseId,
}) {
  const hanldeQuiz = () => {
    localStorage.setItem("courseId", courseId);
    localStorage.setItem("courseTitle", title);
    setActive("addQuiz");
  };

  const cardRef = useRef();

  useGSAP(
    () => {
      if (!loading) {
        gsap.fromTo(
          cardRef.current,
          { x: 200, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
        );
      }
    },
    { dependencies: [loading], scope: cardRef }
  );

  return (
    <div ref={cardRef} className="cardContainer" >
      <div className="cardimg ">
        <img src={thumbnail || "./media/cardimg1.jpg"} alt="hackcard" />
      </div>

      <div className="cardData-Container">
        <h3 className="cardtitle">{title}</h3>
        <p className="cardtext">{description}</p>

        <div className="cardPrice">
          <span className="priceSpan1">
            <i className="fa-solid fa-indian-rupee-sign"></i> {price}
          </span>
          <span priceSpan2>
            <i className="fa-solid fa-circle-user"></i>
            {enrollCount}
          </span>
        </div>

        <button className="courseCardbtn" onClick={hanldeQuiz}>
          Add Quiz
        </button>
      </div>
    </div>
  );
}

export default TeacherCourseCard;
