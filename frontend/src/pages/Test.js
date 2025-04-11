import React, { useState } from "react";

const Test = () => {
  // Questions for the test
  const questions = [
    {
      id: 1,
      question: "Which word is spelled correctly?",
      options: ["Bananna", "Banana", "Bannana"],
      answer: "Banana"
    },
    {
      id: 2,
      question: "Which letter is missing? 'E_p_ant'",
      options: ["h", "l", "m"],
      answer: "h"
    },
    {
      id: 3,
      question: "What is the correct order of these letters? 'A - P - L - P - E'",
      options: ["APPLE", "PALPE", "APLPE"],
      answer: "APPLE"
    },
    {
      id: 4,
      question: "Identify the correct word that sounds like 'Nite'?",
      options: ["Night", "Kite", "Right"],
      answer: "Night"
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerSelection = (option) => {
    setSelectedAnswer(option);
  };

  const handleSubmit = () => {
    if (selectedAnswer === questions[currentQuestionIndex].answer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(""); // Reset selection for next question
    } else {
      setShowResult(true);
    }
  };

  return (
    <div style={styles.container}>
      {showResult ? (
        <div>
          <h2>Test Completed!</h2>
          <p>Your Score: {score} / {questions.length}</p>
          <p>
            {score > 2 ? "🎉 Great Job! Keep Practicing!" : "Keep Trying! Practice Makes Perfect! 💪"}
          </p>
        </div>
      ) : (
        <div>
          <h2>Test Your Learning!</h2>
          <h3>{questions[currentQuestionIndex].question}</h3>
          {questions[currentQuestionIndex].options.map((option, index) => (
            <div key={index}>
              <input
                type="radio"
                name="answer"
                value={option}
                checked={selectedAnswer === option}
                onChange={() => handleAnswerSelection(option)}
              />
              <label>{option}</label>
            </div>
          ))}
          <button onClick={handleSubmit} style={styles.button}>Next</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
  },
  button: {
    padding: "10px 15px",
    fontSize: "16px",
    marginTop: "20px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
  }
};

export default Test;
