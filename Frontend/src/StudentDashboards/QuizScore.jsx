import { useLocation, useNavigate } from "react-router-dom";

function QuizScore() {
  const location = useLocation();
  const studentQuizSubmit = location.state;
  const navigate = useNavigate();

  const { score, totalmark } = studentQuizSubmit || {};

  const getCongratsMessage = (score, total) => {
    const percent = (score / total) * 100;

    if (percent === 100) return "🏆 Perfect! You aced the quiz!";
    if (percent >= 80) return "🎉 Great job! You scored very well!";
    if (percent >= 50) return "👍 Good effort! Keep improving!";
    return "😅 Don’t worry! Try again to improve your score!";
  };

  const handleEnd = () => {
    navigate("/");
  };

  return (
    <div
      className="quizContainer"
      style={{
        marginTop: "2vw",
        gap: "2vw",
        color: "#6B7280",
      }}
    >
      <h3>
        You scored {score}/{totalmark}
      </h3>
      <h4>{getCongratsMessage(score, totalmark)}</h4>

        <button onClick={handleEnd}>End</button>
    
    </div>
  );
}

export default QuizScore;
