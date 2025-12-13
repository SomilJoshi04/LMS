import React, { useState, useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import "./Add.css";
import { handleError, handleSuccess } from "../utils";

function AddQuizzes() {
  // console.log(courseId);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timeLimit: "",
  });

  const [questions, setQuestions] = useState([
    {
      QuestionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      mark: "",
      // type: "MCQ",
    },
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...questions];

    if (e.target.name === "QuestionText" || e.target.name === "type") {
      updatedQuestions[index][e.target.name] = e.target.value;
    } else if (e.target.name.startsWith("option")) {
      const optionIndex = parseInt(e.target.name.split("-")[1]);
      updatedQuestions[index].options[optionIndex] = e.target.value;
    } else if (e.target.name === "correctAnswer") {
      updatedQuestions[index].correctAnswer = e.target.value;
    } else if (e.target.name === "mark") {
      updatedQuestions[index].mark = e.target.value; 
    }
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        QuestionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        mark: "",
      },
    ]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem("userId");
      const courseId = localStorage.getItem("courseId");

      const payload = {
        ...formData,
        questions,
        quizCreatedBy: userId,
        CourseId: courseId,
      };

      const response = await axios.post(
        "https://lms-5-7p4k.onrender.com/quiz/addQuiz",
        payload
      );

      if (response.data.success) {
        handleSuccess(response.data.message);

        localStorage.removeItem("courseId");
        // localStorage.removeItem("courseTitle");

        setFormData({ title: "", description: "", timeLimit: "" });

        setQuestions([
          {
            QuestionText: "",
            options: ["", "", "", ""],
            correctAnswer: "",
            mark: "",
          },
        ]);
      } else {
        handleError(response.data.message);
      }
    } catch (err) {
      handleError(err.message);
    }
  };

  const addQuizzRef = useRef(null);

  useGSAP(() => {
    gsap.from(addQuizzRef.current, {
      x: 200,
      opacity: 0,
      duration: 0.8,
      delay: 0.5,
      stagger: 0.17,
    });

    gsap.from(".addContainer h2", {
      x: 200,
      opacity: 0,
      duration: 0.6,
      delay: 0.5,
    });
  });

  const courseTitle = localStorage.getItem("courseTitle");

  return (
    <div className="addContainer">
      <h2 id="h2">Add New Quiz for {courseTitle} </h2>

      <form onSubmit={handleSubmit} ref={addQuizzRef}>
        <label>Quiz Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Description / Instructions</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <label>Time Limit (minutes)</label>
        <input
          type="number"
          min="0"
          name="timeLimit"
          value={formData.timeLimit}
          onChange={handleChange}
        />

        <h3>Questions</h3>

        {questions.map((q, index) => (
          <div key={index} className="Box">
            <label>Question {index + 1}</label>
            <input
              type="text"
              name="QuestionText"
              value={q.QuestionText}
              onChange={(e) => handleQuestionChange(index, e)}
              required
            />

            <label>Options</label>
            {q.options.map((opt, optIndex) => (
              <input
                key={optIndex}
                type="text"
                name={`option-${optIndex}`}
                value={opt}
                onChange={(e) => handleQuestionChange(index, e)}
                placeholder={`Option ${optIndex + 1}`}
                required
              />
            ))}

            <label>Correct Answer</label>
            <input
              type="text"
              name="correctAnswer"
              value={q.correctAnswer}
              onChange={(e) => handleQuestionChange(index, e)}
              required
            />

            <label>Mark</label>
            <input
              type="number"
              name="mark"
              value={q.mark}
              onChange={(e) => handleQuestionChange(index, e)}
              required
            />

            {/* <label>Question Type</label>
              <select
                name="type"
                value={q.type}
                onChange={(e) => handleQuestionChange(index, e)}
              >
                <option value="MCQ">MCQ</option>
                <option value="True/False">True/False</option>
                <option value="Short Answer">Short Answer</option>
              </select> */}

            {questions.length > 1 && (
              <button type="button" onClick={() => removeQuestion(index)}>
                Remove Question
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addQuestion}>
          + Add Question
        </button>

        <button type="submit">Add Quiz</button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default AddQuizzes;

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Get teacher/user object from localStorage
//       const userId = localStorage.getItem("userId");

//       const payload = {
//         ...formData,
//         modules,
//         createdBy: userId,
//       };

//       const response = await axios.post(
//         "http://localhost:4000/course/addCourse",
//         payload
//       );

//       if (response.data.success) {
//         handleSuccess(response.data.message);
//         setFormData({
//           title: "",
//           description: "",
//           thumbnail: "",
//           createdBy: "",
//           price: "",
//         });

//         setModules({ title: "", content: "", videoUrl: "", duration: "" });

//       } else {
//         handleError(response.data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       handleError("Something went wrong");
//     }
//   };
