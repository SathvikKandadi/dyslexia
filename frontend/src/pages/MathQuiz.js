import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MathQuiz.css";

const MathQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState("");
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      fetchQuestions();
    }
  }, [token]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError("");
    setResult("");
    setUserAnswer("");
    try {
      console.log("Fetching questions...");
      const response = await axios.post("http://localhost:3000/math-quiz", {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Raw response:", response);
      console.log("Response data:", response.data);

      if (!response.data) {
        console.error("No data in response");
        throw new Error("No data received from server");
      }

      if (!response.data.questions) {
        console.error("No questions array in response data:", response.data);
        throw new Error("Server response missing questions array");
      }

      if (!Array.isArray(response.data.questions)) {
        console.error("Questions is not an array:", response.data.questions);
        throw new Error("Invalid questions format from server");
      }

      if (response.data.questions.length === 0) {
        console.error("Empty questions array");
        throw new Error("No questions received from server");
      }

      console.log("Received valid questions:", {
        count: response.data.questions.length,
        sample: response.data.questions[0]
      });

      setQuestions(response.data.questions);
      setCurrentQuestionIndex(0);
    } catch (err) {
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.message || "Failed to fetch questions. Please try again or log in.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (e) => {
    // Only allow numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setUserAnswer(value);
  };

  const checkAnswer = () => {
    if (!userAnswer) {
      setResult("Please enter an answer first.");
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) {
      setError("Question not found. Please try again.");
      return;
    }

    setTotalAttempts(totalAttempts + 1);
    
    // Convert both to numbers for comparison
    const userAnswerNum = parseFloat(userAnswer);
    const correctAnswerNum = parseFloat(currentQuestion.answer);
    
    if (!isNaN(userAnswerNum) && !isNaN(correctAnswerNum) && userAnswerNum === correctAnswerNum) {
      setScore(score + 1);
      setResult("✅ Correct! Well done!");
      updateProgress(true);
      
      // Move to next question after a delay
      setTimeout(() => {
        moveToNextQuestion();
      }, 1500);
    } else {
      setResult(`❌ Incorrect. The correct answer is: ${currentQuestion.answer}`);
      updateProgress(false);
    }
  };

  const moveToNextQuestion = () => {
    setUserAnswer("");
    setResult("");
    
    // Move to next question or cycle back to beginning
    setCurrentQuestionIndex(prevIndex => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= questions.length) {
        // Shuffle the questions when we reach the end
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
        return 0;
      }
      return nextIndex;
    });
  };

  const updateProgress = (correct) => {
    let progress = JSON.parse(localStorage.getItem("studentProgress")) || {
      exercisesCompleted: 0,
      correctAnswers: 0,
      totalQuestions: 0,
      levelsCompleted: 0,
    };
    
    progress.exercisesCompleted += 1;
    progress.totalQuestions += 1;
    if (correct) progress.correctAnswers += 1;
    
    localStorage.setItem("studentProgress", JSON.stringify(progress));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && userAnswer) {
      checkAnswer();
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container">
      <h1>Math Quiz</h1>
      <p>Practice solving simple math problems to improve your skills.</p>
      
      <div className="card">
        {loading ? (
          <p>Loading questions...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : !currentQuestion ? (
          <p>No questions available. Please try again.</p>
        ) : (
          <>
            <div className="question-counter">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>

            <div className="question-section">
              <h2>{currentQuestion.question}</h2>
              <p className="difficulty-label">Difficulty: {currentQuestion.difficulty}</p>
            </div>
            
            <div className="answer-input">
              <input
                type="text"
                value={userAnswer}
                onChange={handleAnswerChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter your answer"
                autoFocus
              />
            </div>
            
            <button 
              onClick={checkAnswer} 
              disabled={!userAnswer}
              className={!userAnswer ? 'disabled' : ''}
            >
              Check Answer
            </button>
            
            {result && (
              <div className={`result ${result.includes("✅") ? "success" : "error"}`}>
                {result}
              </div>
            )}
            
            <div className="score-container">
              <p>Score: {score}/{totalAttempts}</p>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: totalAttempts > 0 ? `${(score / totalAttempts) * 100}%` : "0%" }}
                ></div>
              </div>
            </div>
          </>
        )}
      </div>

      <button 
        onClick={moveToNextQuestion} 
        disabled={loading || !currentQuestion}
        className={loading || !currentQuestion ? 'disabled' : ''}
      >
        {loading ? "Loading..." : "Skip Question"}
      </button>
    </div>
  );
};

export default MathQuiz; 