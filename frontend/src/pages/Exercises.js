import React, { useState, useEffect } from "react";
import useSound from "use-sound";
import './Exercises.css';

// Twisted & Inverted Alphabet Mapping
const twistedAlphabet = {
  A: "∀", B: "𐌁", C: "Ↄ", D: "ᗡ", E: "Ǝ", F: "Ⅎ", G: "⅁",
  H: "H", I: "I", J: "ſ", K: "ʞ", L: "⅂", M: "W", N: "ᴎ",
  O: "O", P: "Ԁ", Q: "Ọ", R: "ᴚ", S: "S", T: "⊥", U: "∩",
  V: "Λ", W: "M", X: "X", Y: "⅄", Z: "Z"
};

// Twisted & Inverted Number Mapping
const twistedNumbers = {
  0: "𝟘", 1: "𝟙", 2: "Ƨ", 3: "Ɛ", 4: "ᔭ", 5: "ϛ",
  6: "9", 7: "ㄥ", 8: "8", 9: "6"
};

const words = ["apple", "banana", "chocolate", "elephant", "giraffe"];
const alphabets = Object.keys(twistedAlphabet);

// Function to get a random number between min and max (inclusive)
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to get a random item from an array
const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const Exercises = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentAlphabet, setCurrentAlphabet] = useState("");
  const [currentNumber, setCurrentNumber] = useState(0);
  const [currentAlphabetImage, setCurrentAlphabetImage] = useState("");

  const [wordInput, setWordInput] = useState("");
  const [alphabetInput, setAlphabetInput] = useState("");
  const [numberInput, setNumberInput] = useState("");
  const [textToSpeech, setTextToSpeech] = useState("");

  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [activeTab, setActiveTab] = useState("word");
  const [showImage, setShowImage] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [playSuccess] = useSound("/assets/success.mp3");
  const [playError] = useSound("/assets/error.mp3");

  const currentWord = words[currentWordIndex];
  const twistedLetter = twistedAlphabet[currentAlphabet];
  
  // Generate a random twisted number for display
  const getRandomTwistedNumber = () => {
    const randomNum = getRandomNumber(0, 100);
    let twistedNum = "";
    
    // Convert each digit to its twisted form
    const numStr = randomNum.toString();
    for (let i = 0; i < numStr.length; i++) {
      const digit = numStr[i];
      twistedNum += twistedNumbers[digit] || digit;
    }
    
    return { original: randomNum, twisted: twistedNum };
  };
  
  const [currentTwistedNumber, setCurrentTwistedNumber] = useState(getRandomTwistedNumber());

  useEffect(() => {
    if (score >= 5) {
      setMessage("🎉 Level Up! Keep going!");
      setScore(0);
    }
  }, [score]);

  // Initialize with a random alphabet
  useEffect(() => {
    selectRandomAlphabet();
  }, []);

  // Function to select a random alphabet and its image
  const selectRandomAlphabet = () => {
    const randomAlphabet = getRandomItem(alphabets);
    setCurrentAlphabet(randomAlphabet);
    
    // Generate a random image path for the selected alphabet
    // The image path format is /test/[ALPHABET]/[ALPHABET]-[NUMBER]_png.rf.[HASH].jpg
    const randomImageNumber = getRandomNumber(1, 2500);
    const randomHash = Math.random().toString(36).substring(2, 15);
    const imagePath = `/test/${randomAlphabet}/${randomAlphabet}-${randomImageNumber}_png.rf.${randomHash}.jpg`;
    
    setCurrentAlphabetImage(imagePath);
  };

  // ✅ Word Matching Game Logic
  const checkWordAnswer = () => {
    if (wordInput.toLowerCase() === currentWord.toLowerCase()) {
      playSuccess();
      setMessage("✅ Correct!");
      setIsCorrect(true);
      setShowImage(true);
      setScore(score + 1);
      
      // Hide image after 2 seconds
      setTimeout(() => {
        setShowImage(false);
        nextWord();
      }, 2000);
    } else {
      playError();
      setMessage("❌ Try Again!");
      setIsCorrect(false);
      setShowImage(true);
      
      // Hide image after 2 seconds
      setTimeout(() => {
        setShowImage(false);
      }, 2000);
    }
  };

  const nextWord = () => {
    setWordInput("");
    setCurrentWordIndex((prev) => (prev + 1) % words.length);
  };

  const speakWord = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord);
      utterance.lang = "en-US";
      speechSynthesis.speak(utterance);
    } else {
      alert("Your browser doesn't support text-to-speech!");
    }
  };

  // ✅ Identify Twisted Alphabet Logic
  const checkAlphabetAnswer = () => {
    if (alphabetInput.toUpperCase() === currentAlphabet) {
      playSuccess();
      setMessage("✅ Correct!");
      setIsCorrect(true);
      setShowImage(true);
      setScore(score + 1);
      
      // Hide image after 2 seconds
      setTimeout(() => {
        setShowImage(false);
        nextAlphabet();
      }, 2000);
    } else {
      playError();
      setMessage("❌ Try Again!");
      setIsCorrect(false);
      setShowImage(true);
      
      // Hide image after 2 seconds
      setTimeout(() => {
        setShowImage(false);
      }, 2000);
    }
  };

  const nextAlphabet = () => {
    setAlphabetInput("");
    selectRandomAlphabet();
  };

  // ✅ Identify Twisted Number Logic
  const checkNumberAnswer = () => {
    if (parseInt(numberInput) === currentTwistedNumber.original) {
      playSuccess();
      setMessage("✅ Correct!");
      setIsCorrect(true);
      setShowImage(true);
      setScore(score + 1);
      
      // Hide image after 2 seconds
      setTimeout(() => {
        setShowImage(false);
        nextNumber();
      }, 2000);
    } else {
      playError();
      setMessage("❌ Try Again!");
      setIsCorrect(false);
      setShowImage(true);
      
      // Hide image after 2 seconds
      setTimeout(() => {
        setShowImage(false);
      }, 2000);
    }
  };

  const nextNumber = () => {
    setNumberInput("");
    setCurrentTwistedNumber(getRandomTwistedNumber());
  };

  // ✅ Text-to-Speech
  const speakCustomText = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeech);
      utterance.lang = "en-US";
      speechSynthesis.speak(utterance);
    } else {
      alert("Your browser doesn't support text-to-speech!");
    }
  };

  return (
    <div className="container">
      <h1>Practice Exercises</h1>
      <p>Choose an exercise type to practice different skills.</p>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === "word" ? "active" : ""}`}
          onClick={() => setActiveTab("word")}
        >
          Word Matching
        </button>
        <button 
          className={`tab ${activeTab === "alphabet" ? "active" : ""}`}
          onClick={() => setActiveTab("alphabet")}
        >
          Alphabet Identification
        </button>
        <button 
          className={`tab ${activeTab === "number" ? "active" : ""}`}
          onClick={() => setActiveTab("number")}
        >
          Number Identification
        </button>
        <button 
          className={`tab ${activeTab === "speech" ? "active" : ""}`}
          onClick={() => setActiveTab("speech")}
        >
          Text-to-Speech
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "word" && (
          <div className="card">
            <h2>Word Matching Game</h2>
            <p>Type the word you hear or see:</p>
            <div className="display-box">
              <h3>{currentWord}</h3>
            </div>
            <div className="input-group">
              <input
                type="text"
                value={wordInput}
                onChange={(e) => setWordInput(e.target.value)}
                placeholder="Type here..."
              />
              <button onClick={checkWordAnswer}>Check</button>
            </div>
            <button className="secondary-button" onClick={speakWord}>
              🔊 Hear Word
            </button>
            {message && <p className={`message ${message.includes("Correct") ? "success" : "error"}`}>{message}</p>}
            <div className="score">Score: {score}/5</div>
            
            {showImage && (
              <div className="feedback-image">
                <img 
                  src={isCorrect ? "/correctanswerimage.jpeg" : "/wronganswerimage.jpeg"} 
                  alt={isCorrect ? "Correct" : "Incorrect"} 
                />
              </div>
            )}
          </div>
        )}

        {activeTab === "alphabet" && (
          <div className="card">
            <h2>Identify the Alphabet</h2>
            <p>What letter is this?</p>
            <div className="display-box">
              <img 
                src={currentAlphabetImage} 
                alt={`Letter ${currentAlphabet}`} 
                className="alphabet-image"
                onError={(e) => {
                  // Fallback to twisted letter if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'block';
                }}
              />
              <h3 className="fallback-letter" style={{ display: 'none' }}>{twistedLetter}</h3>
            </div>
            <div className="input-group">
              <input
                type="text"
                value={alphabetInput}
                onChange={(e) => setAlphabetInput(e.target.value)}
                placeholder="Enter the correct letter"
              />
              <button onClick={checkAlphabetAnswer}>Check</button>
            </div>
            {message && <p className={`message ${message.includes("Correct") ? "success" : "error"}`}>{message}</p>}
            <div className="score">Score: {score}/5</div>
            
            {showImage && (
              <div className="feedback-image">
                <img 
                  src={isCorrect ? "/correctanswerimage.jpeg" : "/wronganswerimage.jpeg"} 
                  alt={isCorrect ? "Correct" : "Incorrect"} 
                />
              </div>
            )}
          </div>
        )}

        {activeTab === "number" && (
          <div className="card">
            <h2>Identify the Number</h2>
            <p>What number is this?</p>
            <div className="display-box">
              <h3>{currentTwistedNumber.twisted}</h3>
            </div>
            <div className="input-group">
              <input
                type="text"
                value={numberInput}
                onChange={(e) => setNumberInput(e.target.value)}
                placeholder="Enter the correct number"
              />
              <button onClick={checkNumberAnswer}>Check</button>
            </div>
            {message && <p className={`message ${message.includes("Correct") ? "success" : "error"}`}>{message}</p>}
            <div className="score">Score: {score}/5</div>
            
            {showImage && (
              <div className="feedback-image">
                <img 
                  src={isCorrect ? "/correctanswerimage.jpeg" : "/wronganswerimage.jpeg"} 
                  alt={isCorrect ? "Correct" : "Incorrect"} 
                />
              </div>
            )}
          </div>
        )}

        {activeTab === "speech" && (
          <div className="card">
            <h2>Text-to-Speech Converter</h2>
            <p>Type any text and hear it spoken aloud:</p>
            <textarea
              rows="3"
              placeholder="Type something here..."
              value={textToSpeech}
              onChange={(e) => setTextToSpeech(e.target.value)}
            />
            <button onClick={speakCustomText} disabled={!textToSpeech}>
              🔊 Speak
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercises;
