import React, { useState, useEffect } from "react";
import useSound from "use-sound";
import './NumberAlphabetTest.css';

const levels = [
  { id: 1, type: "Letters", data: ["A", "B", "C", "D", "E"] }, // Letters
  { id: 2, type: "Words", data: ["Apple", "Ball", "Cat", "Dog", "Egg"] }, // Words
  { id: 3, type: "Sentences", data: ["I like apples.", "The sun is bright.", "Reading is fun."] } // Sentences
];

const NumberAlphabetTest = () => {
  const [level, setLevel] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);

  const [playSuccess] = useSound("/assets/success.mp3");
  const [playError] = useSound("/assets/error.mp3");

  const currentLevelData = levels[level - 1];
  const currentItem = currentLevelData.data[currentIndex];

  useEffect(() => {
    if (score === currentLevelData.data.length) {
      if (level < levels.length) {
        setTimeout(() => {
          setLevel(level + 1);
          setScore(0);
          setCurrentIndex(0);
          setMessage(`🎉 Level Up! Welcome to ${levels[level].type} Level`);
        }, 1000);
      } else {
        setMessage("🏆 Congratulations! You've mastered all levels!");
      }
    }
  }, [score]);

  const checkAnswer = () => {
    if (userInput.toLowerCase() === currentItem.toLowerCase()) {
      playSuccess();
      setMessage("✅ Correct!");
      setScore(score + 1);
      updateProgress(true);
      nextItem();
    } else {
      playError();
      setMessage("❌ Try Again!");
      updateProgress(false);
    }
  };

  const nextItem = () => {
    setUserInput("");
    setCurrentIndex((prevIndex) => (prevIndex + 1) % currentLevelData.data.length);
  };

  const updateProgress = (correct) => {
    let progress = JSON.parse(localStorage.getItem("testProgress")) || { level: 1, correctAnswers: 0, totalQuestions: 0 };
    progress.totalQuestions += 1;
    if (correct) progress.correctAnswers += 1;
    progress.level = level;
    localStorage.setItem("testProgress", JSON.stringify(progress));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Level {level} - {currentLevelData.type} Test</h1>
      <p>Type or say the following:</p>
      <h3 style={styles.word}>{currentItem}</h3>
      
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        style={styles.input}
        placeholder="Type your answer..."
      />
      <button style={styles.button} onClick={checkAnswer}>Check</button>

      <p style={styles.result}>{message}</p>
      <h3>Score: {score}/{currentLevelData.data.length}</h3>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    textAlign: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "28px",
    color: "#333",
  },
  word: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#222",
  },
  input: {
    padding: "8px",
    fontSize: "16px",
    margin: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "10px",
  },
  result: {
    fontSize: "18px",
    fontWeight: "bold",
  },
};

export default NumberAlphabetTest;
