import React, { useState, useEffect } from "react";
import axios from "axios";
import useSound from "use-sound";
import "./SpellCheck.css";

const SpellCheck = () => {
  const [wordList, setWordList] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [result, setResult] = useState("");
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [showImage, setShowImage] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [audioError, setAudioError] = useState(false);
  
  const [playSuccess] = useSound("/assets/success.mp3");
  const [playError] = useSound("/assets/error.mp3");

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to access this feature.");
        setLoading(false);
        return;
      }

      // Try to load words from localStorage first
      const cachedWords = localStorage.getItem("spellCheckWords");
      if (cachedWords) {
        try {
          const parsed = JSON.parse(cachedWords);
          if (Array.isArray(parsed) && parsed.length > 0 && 
              parsed.every(word => 
                word.correct && 
                word.category && 
                Array.isArray(word.options) && 
                word.options.length === 4 &&
                word.options.includes(word.correct)
              )) {
            console.log("Using cached words:", { 
              count: parsed.length, 
              sample: parsed[0],
              sampleOptions: parsed[0].options
            });
            setWordList(parsed);
            setLoading(false);
            return;
          } else {
            console.log("Invalid cached words format, fetching new words");
            localStorage.removeItem("spellCheckWords");
          }
        } catch (err) {
          console.error("Error parsing cached words:", err);
          localStorage.removeItem("spellCheckWords");
        }
      }

      console.log("Fetching words from server...");
      const response = await axios.get("http://localhost:3000/spellcheck", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Server response:", response.data);
      
      if (!response.data || typeof response.data !== 'object') {
        console.error("Invalid response:", response.data);
        throw new Error("Invalid server response");
      }

      if (!response.data.words || !Array.isArray(response.data.words)) {
        console.error("Response missing words array:", response.data);
        throw new Error("Server response missing words array");
      }

      const words = response.data.words;
      
      if (words.length === 0) {
        console.error("Empty words array received");
        throw new Error("No words received from server");
      }

      // Log first word for debugging
      console.log("First word from server:", words[0]);

      // Validate each word object
      const validWords = words.filter(word => 
        word && 
        typeof word.correct === 'string' && 
        typeof word.category === 'string' && 
        Array.isArray(word.options) && 
        word.options.length === 4 &&
        word.options.includes(word.correct)
      );

      if (validWords.length === 0) {
        console.error("No valid words in response. Sample word:", words[0]);
        throw new Error("No valid words found in server response");
      }

      console.log("Successfully loaded words:", {
        total: validWords.length,
        sample: validWords[0],
        sampleOptions: validWords[0].options
      });

      // Store words in localStorage
      localStorage.setItem("spellCheckWords", JSON.stringify(validWords));
      setWordList(validWords);
    } catch (err) {
      console.error("Error fetching words:", err);
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("spellCheckWords");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(`Failed to fetch words: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const getCurrentWord = () => wordList[currentWordIndex] || null;

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setResult(""); // Clear previous result when new option is selected
  };

  const moveToNextWord = () => {
    setSelectedOption("");
    setResult("");
    
    // Move to next word or cycle back to beginning
    setCurrentWordIndex(prevIndex => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= wordList.length) {
        // Shuffle the word list when we reach the end
        const shuffled = shuffleArray([...wordList]);
        setWordList(shuffled);
        return 0;
      }
      return nextIndex;
    });
  };

  const checkAnswer = () => {
    const currentWord = getCurrentWord();
    if (!selectedOption) {
      setResult("Please select an option first.");
      return;
    }

    if (!currentWord) {
      setError("Word data is missing. Please try again.");
      return;
    }

    setTotalAttempts(prev => prev + 1);
    const isAnswerCorrect = selectedOption === currentWord.correct;
    setIsCorrect(isAnswerCorrect);
    setShowImage(true);

    if (isAnswerCorrect) {
      setScore(prev => prev + 1);
      setResult("✅ Correct! Well done!");
      playCorrectSound();
      // Wait a bit longer before moving to next word
      setTimeout(() => {
        setShowImage(false);
        moveToNextWord();
      }, 1500);
    } else {
      setResult(`❌ Incorrect. The correct spelling is "${currentWord.correct}"`);
      playWrongSound();
      // Show the error state briefly
      setTimeout(() => {
        setShowImage(false);
      }, 1500);
    }
  };

  const playCorrectSound = () => {
    try {
      playSuccess();
    } catch (err) {
      console.error("Error playing success sound:", err);
      setAudioError(true);
    }
  };

  const playWrongSound = () => {
    try {
      playError();
    } catch (err) {
      console.error("Error playing error sound:", err);
      setAudioError(true);
    }
  };

  // Function to shuffle array (for reordering words)
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  if (loading) {
    return (
      <div className="container">
        <h1>Spell Check</h1>
        <div className="card">
          <p>Loading words...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1>Spell Check</h1>
        <div className="card">
          <p className="error-message">{error}</p>
          <button onClick={loadWords}>Try Again</button>
        </div>
      </div>
    );
  }

  const currentWord = getCurrentWord();

  return (
    <div className="container">
      <h1>Spell Check</h1>
      <div className="card">
        <div className="score-container">
          <p>Score: {score}/{totalAttempts}</p>
          <p>Success Rate: {totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0}%</p>
        </div>

        <div className="question-section">
          <h2>Select the correct spelling:</h2>
          {currentWord && <p className="category-label">Category: {currentWord.category}</p>}
        </div>

        {currentWord ? (
          <div className="game-section">
            <div className="options-grid">
              {currentWord.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${selectedOption === option ? "selected" : ""} ${
                    result && option === currentWord.correct ? "correct" : ""
                  } ${result && selectedOption === option && option !== currentWord.correct ? "incorrect" : ""}`}
                  onClick={() => handleOptionSelect(option)}
                  disabled={!!result}
                >
                  {option}
                </button>
              ))}
            </div>

            <button 
              className="check-answer-button"
              onClick={checkAnswer} 
              disabled={!selectedOption || !!result}
            >
              Check Answer
            </button>

            {result && (
              <div className={`result-message ${result.includes("✅") ? "success" : "error"}`}>
                {result}
              </div>
            )}
          </div>
        ) : (
          <p className="error-message">No words available. Please try again.</p>
        )}
      </div>
    </div>
  );
};

export default SpellCheck; 