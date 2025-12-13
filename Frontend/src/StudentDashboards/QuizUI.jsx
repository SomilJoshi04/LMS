import { useEffect } from "react";
import { useState } from "react";
import { handleError, handleSuccess } from "../utils";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import "./QuizUI.css";
import { ToastContainer } from "react-toastify";

function QuizUI() {
  const [quiz, setQuiz] = useState(null);
  const { quizId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedOption, setSelectedOption] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getQuiz = async () => {
      try {
        const response = await axios.get(
          `https://lms-5-7p4k.onrender.com/quiz/getQuiz/${quizId}`
        );

        if (response.data.success) {
          handleSuccess(response.data.message);
          setQuiz(response.data.quiz);
        } else {
          handleError(response.data.message);
        }
      } catch (err) {
        handleError(err.message);
      }
    };

    getQuiz();
  }, [quizId]);

  // if (!quiz) return <p className="quizContainer">Loading quiz...</p>;

  const currentQuestion = quiz.questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSelect = (index) => {
    const updated = [...selectedOption]; // copy existing array
    updated[currentIndex] = currentQuestion.options[index]; // save answer text
    setSelectedOption(updated);
  };

  const handleQuizSubmit = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post(
        "http://localhost:4000/quiz/QuizSubmit",
        {
          studentId: userId,
          quizId,
          answers: selectedOption,
          score: 0,
        }
      );

      if (response.data.success) {
        handleSuccess(response.data.message);
        const studentQuizSubmit = response.data.studentQuizSubmit;

        let totalmark = 0;
        for (let i = 0; i < quiz.questions.length; i++) {
          totalmark += quiz.questions[i].mark;
        }

        const studentData = { ...studentQuizSubmit, totalmark };

        navigate("/quiz/QuizScore", { state: studentData });
      } else {
        handleError(response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="quiz-container">
      <div className="totatCount">
        Questions {currentIndex + 1}/{quiz.questions.length}
      </div>

      <div className="quizInfo-container">
        <div className="questions">
          <h4>{currentQuestion.QuestionText}</h4>
        </div>
        <h3>{currentQuestion.mark} mark</h3>
        <div className="quiz-timer">Timer</div>
        {currentQuestion.options.map((opt, i) => (
          <div className="quiz-option" key={i}>
            {/* <p>{i + 1}</p> */}
            <button
              className={`quiz-btn ${
                selectedOption[currentIndex] === opt ? "selected" : ""
              }`}
              onClick={() => handleSelect(i)}
              data-option={i + 1}
            >
              {opt}
            </button>
          </div>
        ))}
        <div className="btn-container">
          <button onClick={handlePrevious} disabled={currentIndex === 0}>
            Previous
          </button>

          {currentIndex != quiz.questions.length - 1 && (
            <button onClick={handleNext}>Next</button>
          )}

          {currentIndex === quiz.questions.length - 1 && (
            <button onClick={handleQuizSubmit}>Submit</button>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default QuizUI;
