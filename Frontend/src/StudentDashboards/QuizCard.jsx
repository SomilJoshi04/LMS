import axios from "axios";
import { handleError } from "../utils";
import { useState, useEffect } from "react";
import { FadeLoader } from "react-spinners";
import "./QuizCard.css";
import { ToastContainer } from "react-toastify";
import QuizUI from "./QuizUI";
import { useNavigate } from "react-router-dom";
function QuizCard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllQuizzes = async () => {
      try {
        const response = await axios.get(
          "https://lms-5-7p4k.onrender.com/quiz/getAllQuizzes"
        );

        

        if (response.data.success) {
          setQuizzes(response.data.quizzes);
          setIsLoading(false);
        } else {
          handleError(response.data.message);
        }
      } catch (err) {
        handleError(err.message);
      }
    };

    fetchAllQuizzes();
  }, []);

  const handleTakeQuiz = async (quiz) => {
    try {
      const userId = sessionStorage.getItem("userId");

      const response = await axios.post(
        "https://lms-5-7p4k.onrender.com/quiz/checkQuizAccess",
        {
          userId: userId,
          courseId: quiz.CourseId._id,
        }
      );

    

      if (response.data.success) {
        navigate(`/quiz/${quiz._id}`);
      } else {
        handleError(response.data.message);
      }
    } catch (err) {
      console.error(err.message);
      handleError(err.message);
    }
  };

  return (
    <div className="quizContainer">
      {quizzes.length > 0 ? (
        <h2>Available Quizzes</h2>
      ) : (
        <h2>No Quizzes Available yet</h2>
      )}

      {loading ? (
        <div className="loader-wrapper">
          <FadeLoader />
        </div>
      ) : (
        <div className="quizInfo-Container">
          {quizzes?.map((q) => (
            <div className="cardContainer" key={q._id}>
              <div className="cardData-Container">
                  <h3 className="title">Course: {q.CourseId?.title ||  "No Course Title"}</h3>
                <h4 className="title">{q.title || "No Quiz Title"}</h4>
                <button
                  className="courseCardbtn"
                  onClick={() => handleTakeQuiz(q)}
                >
                  Take Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default QuizCard;



