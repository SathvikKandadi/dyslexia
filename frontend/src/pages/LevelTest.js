import React, { useState, useEffect } from "react";
import axios from "axios";
import useSound from "use-sound";
import "./LevelTest.css";

// Comprehensive question bank for spell check
const spellCheckQuestionBank = [
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["accomodate", "accommodate", "acommodate"],
    answer: "accommodate"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["definately", "definitely", "definatly"],
    answer: "definitely"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["occurence", "occurrence", "ocurrence"],
    answer: "occurrence"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["seperate", "separate", "seperat"],
    answer: "separate"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["necessary", "neccessary", "necesary"],
    answer: "necessary"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["recieve", "receive", "recieive"],
    answer: "receive"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["committment", "commitment", "comitment"],
    answer: "commitment"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["priviledge", "privilege", "privelege"],
    answer: "privilege"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["maintainance", "maintenance", "maintainence"],
    answer: "maintenance"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["persistant", "persistent", "persistint"],
    answer: "persistent"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["conscientious", "conscienteous", "conscienteous"],
    answer: "conscientious"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["accomplish", "acomplish", "accomplis"],
    answer: "accomplish"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["embarrass", "embarass", "embarras"],
    answer: "embarrass"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["excellent", "excelent", "excellant"],
    answer: "excellent"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["environment", "enviroment", "enviorment"],
    answer: "environment"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["experience", "experiance", "experence"],
    answer: "experience"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["government", "goverment", "govenment"],
    answer: "government"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["independent", "independant", "indepedent"],
    answer: "independent"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["knowledge", "knowlege", "knowledg"],
    answer: "knowledge"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["opportunity", "oppertunity", "oportunity"],
    answer: "opportunity"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["particular", "particlar", "particuler"],
    answer: "particular"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["responsibility", "responsability", "responsibilty"],
    answer: "responsibility"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["successful", "succesful", "successfull"],
    answer: "successful"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["technique", "technic", "technicque"],
    answer: "technique"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["unfortunately", "unfortunatly", "unfortunatley"],
    answer: "unfortunately"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["valuable", "valuble", "valuible"],
    answer: "valuable"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["weather", "wether", "whether"],
    answer: "weather"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["whether", "wether", "weather"],
    answer: "whether"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["writing", "writting", "writting"],
    answer: "writing"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["yesterday", "yesturday", "yesterdai"],
    answer: "yesterday"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["academic", "acadamic", "academic"],
    answer: "academic"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["business", "buisness", "busness"],
    answer: "business"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["calendar", "calender", "calandar"],
    answer: "calendar"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["decision", "decission", "decisin"],
    answer: "decision"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["efficient", "efficent", "efficeint"],
    answer: "efficient"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["familiar", "familiar", "familiar"],
    answer: "familiar"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["guarantee", "garantee", "garanty"],
    answer: "guarantee"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["height", "hight", "heigth"],
    answer: "height"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["immediate", "immediat", "immediat"],
    answer: "immediate"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["judgment", "judgement", "judgemnt"],
    answer: "judgment"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["language", "langauge", "languge"],
    answer: "language"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["measure", "mesure", "measur"],
    answer: "measure"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["notice", "notise", "notic"],
    answer: "notice"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["opinion", "opion", "opnion"],
    answer: "opinion"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["parallel", "paralel", "parralel"],
    answer: "parallel"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["question", "queston", "qustion"],
    answer: "question"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["reference", "referance", "refrence"],
    answer: "reference"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["schedule", "scedule", "scedual"],
    answer: "schedule"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["temperature", "temprature", "temperture"],
    answer: "temperature"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["until", "untill", "untill"],
    answer: "until"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["vacuum", "vacum", "vacuum"],
    answer: "vacuum"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["weight", "wieght", "wight"],
    answer: "weight"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["xylophone", "xylaphone", "xylaphone"],
    answer: "xylophone"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["yield", "yeild", "yieled"],
    answer: "yield"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["zodiac", "zodiak", "zodiak"],
    answer: "zodiac"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["abbreviate", "abreviate", "abbreviate"],
    answer: "abbreviate"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["boundary", "boundry", "boundery"],
    answer: "boundary"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["candidate", "candidat", "candidat"],
    answer: "candidate"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["dictionary", "dictionary", "dictionary"],
    answer: "dictionary"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["efficient", "efficent", "efficeint"],
    answer: "efficient"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["familiar", "familiar", "familiar"],
    answer: "familiar"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["guarantee", "garantee", "garanty"],
    answer: "guarantee"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["height", "hight", "heigth"],
    answer: "height"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["immediate", "immediat", "immediat"],
    answer: "immediate"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["judgment", "judgement", "judgemnt"],
    answer: "judgment"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["language", "langauge", "languge"],
    answer: "language"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["measure", "mesure", "measur"],
    answer: "measure"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["notice", "notise", "notic"],
    answer: "notice"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["opinion", "opion", "opnion"],
    answer: "opinion"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["parallel", "paralel", "parralel"],
    answer: "parallel"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["question", "queston", "qustion"],
    answer: "question"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["reference", "referance", "refrence"],
    answer: "reference"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["schedule", "scedule", "scedual"],
    answer: "schedule"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["temperature", "temprature", "temperture"],
    answer: "temperature"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["until", "untill", "untill"],
    answer: "until"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["vacuum", "vacum", "vacuum"],
    answer: "vacuum"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["weight", "wieght", "wight"],
    answer: "weight"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["xylophone", "xylaphone", "xylaphone"],
    answer: "xylophone"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["yield", "yeild", "yieled"],
    answer: "yield"
  },
  {
    type: "reading_spelling",
    question: "Select the correct spelling:",
    options: ["zodiac", "zodiak", "zodiak"],
    answer: "zodiac"
  }
];

// Utility function to shuffle array
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const LevelTest = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState("");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [showImage, setShowImage] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [playSuccess] = useSound("/assets/success.mp3");
  const [playError] = useSound("/assets/error.mp3");

  // Define the structure of each level
  const levelStructure = [
    {
      name: "Letter & Number Identification",
      description: "Identify letters and numbers that may appear differently.",
      questionCount: 5,
      type: "identification"
    },
    {
      name: "Reading & Spelling",
      description: "Read sentences and identify correct spellings.",
      questionCount: 5,
      type: "reading_spelling"
    },
    {
      name: "Math & Problem Solving",
      description: "Solve math problems and answer questions about text.",
      questionCount: 5,
      type: "math_problem"
    }
  ];

  useEffect(() => {
    if (token) {
      generateQuestionsForLevel(currentLevel);
    } else {
      setError("Please log in to access this feature.");
      setLoading(false);
    }
  }, [currentLevel, token]);

  const generateQuestionsForLevel = async (level) => {
    setLoading(true);
    setError("");
    setResult("");
    setUserAnswer("");
    setCurrentQuestionIndex(0);
    setShowLevelComplete(false);
    
    try {
      // Generate questions based on level type
      const levelQuestions = [];
      
      if (level === 1) {
        // Level 1: Letter & Number Identification
        const twistedAlphabet = {
          A: "∀", B: "𐌁", C: "Ↄ", D: "ᗡ", E: "Ǝ", F: "Ⅎ", G: "⅁",
          H: "H", I: "I", J: "ſ", K: "ʞ", L: "⅂", M: "W", N: "ᴎ",
          O: "O", P: "Ԁ", Q: "Ọ", R: "ᴚ", S: "S", T: "⊥", U: "∩",
          V: "Λ", W: "M", X: "X", Y: "⅄", Z: "Z"
        };
        
        const twistedNumbers = {
          0: "𝟘", 1: "𝟙", 2: "Ƨ", 3: "Ɛ", 4: "ᔭ", 5: "ϛ",
          6: "9", 7: "ㄥ", 8: "8", 9: "6"
        };
        
        // Generate 5 random questions
        for (let i = 0; i < 5; i++) {
          const isLetter = Math.random() > 0.5;
          let item, twistedItem;
          
          if (isLetter) {
            const letters = Object.keys(twistedAlphabet);
            item = letters[Math.floor(Math.random() * letters.length)];
            twistedItem = twistedAlphabet[item];
          } else {
            const numbers = Object.keys(twistedNumbers);
            item = numbers[Math.floor(Math.random() * numbers.length)];
            twistedItem = twistedNumbers[item];
          }
          
          levelQuestions.push({
            type: "identification",
            question: `What is this ${isLetter ? "letter" : "number"}?`,
            display: twistedItem,
            answer: item,
            options: isLetter 
              ? [item, String.fromCharCode(item.charCodeAt(0) + 1), String.fromCharCode(item.charCodeAt(0) - 1)]
              : [item, (parseInt(item) + 1).toString(), (parseInt(item) - 1).toString()]
          });
        }
      } else if (level === 2) {
        // Level 2: Reading & Spelling
        try {
          // Fetch words from the backend
          const response = await axios.get("http://localhost:3000/spellcheck", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (!response.data || !response.data.words || !Array.isArray(response.data.words)) {
            throw new Error("Invalid response from server");
          }

          // Get 5 random words from the response
          const words = shuffleArray(response.data.words).slice(0, 5);
          
          words.forEach(word => {
            levelQuestions.push({
              type: "reading_spelling",
              question: `Select the correct spelling for: ${word.category}`,
              options: word.options,
              answer: word.correct,
              category: word.category
            });
          });

        } catch (err) {
          console.error("Error fetching spelling questions:", err);
          // Fallback questions if API fails
          const fallbackQuestions = [
            {
              type: "reading_spelling",
              question: "Select the correct spelling:",
              options: ["apple", "aple", "appel", "appl"],
              answer: "apple",
              category: "fruit"
            },
            {
              type: "reading_spelling",
              question: "Select the correct spelling:",
              options: ["cat", "kat", "catt", "cet"],
              answer: "cat",
              category: "animal"
            },
            {
              type: "reading_spelling",
              question: "Select the correct spelling:",
              options: ["bird", "berd", "burd", "birrd"],
              answer: "bird",
              category: "animal"
            },
            {
              type: "reading_spelling",
              question: "Select the correct spelling:",
              options: ["blue", "bloo", "blew", "blu"],
              answer: "blue",
              category: "color"
            },
            {
              type: "reading_spelling",
              question: "Select the correct spelling:",
              options: ["rain", "rane", "rayn", "rein"],
              answer: "rain",
              category: "weather"
            }
          ];
          levelQuestions.push(...fallbackQuestions);
        }
      } else if (level === 3) {
        // Level 3: Math & Problem Solving
        try {
          // Fetch questions from the backend
          const response = await axios.get("http://localhost:3000/math-quiz", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (!response.data || !response.data.questions || !Array.isArray(response.data.questions)) {
            throw new Error("Invalid response from server");
          }

          // Get 5 random questions from the response
          const mathQuestions = shuffleArray(response.data.questions).slice(0, 5);
          
          mathQuestions.forEach(question => {
            levelQuestions.push({
              type: "math_problem",
              question: question.question,
              answer: question.answer,
              difficulty: question.difficulty
            });
          });

        } catch (err) {
          console.error("Error fetching math questions:", err);
          // Fallback to hardcoded questions if API fails
          const fallbackQuestions = [
            {
              type: "math_problem",
              question: "What is 7 + 8?",
              answer: "15",
              difficulty: "easy"
            },
            {
              type: "math_problem",
              question: "What is 12 - 5?",
              answer: "7",
              difficulty: "easy"
            },
            {
              type: "math_problem",
              question: "What is 4 × 6?",
              answer: "24",
              difficulty: "medium"
            },
            {
              type: "math_problem",
              question: "What is 20 ÷ 4?",
              answer: "5",
              difficulty: "medium"
            },
            {
              type: "math_problem",
              question: "What is 9 + 7?",
              answer: "16",
              difficulty: "easy"
            }
          ];
          levelQuestions.push(...fallbackQuestions);
        }
      }
      
      setQuestions(levelQuestions);
    } catch (err) {
      setError("Failed to generate questions. Please try again or log in.");
      console.error("Error generating questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (e) => {
    setUserAnswer(e.target.value);
  };

  const handleOptionSelect = (option) => {
    setUserAnswer(option);
  };

  const playCorrectSound = () => {
    try {
      playSuccess();
    } catch (err) {
      console.error("Error playing success sound:", err);
    }
  };

  const playWrongSound = () => {
    try {
      playError();
    } catch (err) {
      console.error("Error playing error sound:", err);
    }
  };

  const checkAnswer = () => {
    if (!userAnswer) {
      setResult("Please provide an answer first.");
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) {
      setError("Question not found. Please try again.");
      return;
    }

    let isCorrect = false;
    
    if (currentQuestion.type === "identification" || currentQuestion.type === "reading_spelling") {
      isCorrect = userAnswer === currentQuestion.answer;
    } else if (currentQuestion.type === "math_problem") {
      const userAnswerNum = parseFloat(userAnswer);
      const correctAnswerNum = parseFloat(currentQuestion.answer);
      isCorrect = !isNaN(userAnswerNum) && !isNaN(correctAnswerNum) && userAnswerNum === correctAnswerNum;
    }
    
    // Set the image and play sound based on correctness
    setIsCorrect(isCorrect);
    setShowImage(true);
    
    if (isCorrect) {
      setScore(score + 1);
      setResult("✅ Correct! Well done!");
      playCorrectSound();
    } else {
      setResult(`❌ Incorrect. The correct answer is: ${currentQuestion.answer}`);
      playWrongSound();
    }
    
    // Hide the image after 2 seconds
    setTimeout(() => {
      setShowImage(false);
    }, 2000);
    
    // Move to next question or complete level
    if (currentQuestionIndex + 1 < questions.length) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserAnswer("");
        setResult("");
      }, 1500);
    } else {
      setTimeout(() => {
        setShowLevelComplete(true);
        updateProgress();
      }, 1500);
    }
  };

  const updateProgress = () => {
    let progress = JSON.parse(localStorage.getItem("studentProgress")) || {
      exercisesCompleted: 0,
      correctAnswers: 0,
      totalQuestions: 0,
      levelsCompleted: 0,
    };
    
    progress.exercisesCompleted += 1;
    progress.totalQuestions += questions.length;
    progress.correctAnswers += score;
    
    // Only increment levelsCompleted if all questions were answered correctly
    if (score === questions.length) {
      progress.levelsCompleted += 1;
    }
    
    localStorage.setItem("studentProgress", JSON.stringify(progress));
  };

  const nextLevel = () => {
    if (currentLevel < levelStructure.length) {
      setCurrentLevel(currentLevel + 1);
      setScore(0);
    } else {
      setShowFinalResults(true);
    }
  };

  const restartTest = () => {
    setCurrentLevel(1);
    setScore(0);
    setShowFinalResults(false);
    generateQuestionsForLevel(1);
  };

  if (loading) {
    return (
      <div className="container">
        <h1>Level {currentLevel} - {levelStructure[currentLevel - 1].name}</h1>
        <p>Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1>Level {currentLevel} - {levelStructure[currentLevel - 1].name}</h1>
        <p className="error-message">{error}</p>
        <button onClick={() => generateQuestionsForLevel(currentLevel)}>Try Again</button>
      </div>
    );
  }

  if (showFinalResults) {
    return (
      <div className="container">
        <h1>Test Completed!</h1>
        <div className="card">
          <h2>Final Results</h2>
          <p>You've completed all {levelStructure.length} levels!</p>
          <p>Total Score: {score} out of {questions.length}</p>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${(score / questions.length) * 100}%` }}
            ></div>
          </div>
          <button onClick={restartTest}>Restart Test</button>
        </div>
      </div>
    );
  }

  if (showLevelComplete) {
    return (
      <div className="container">
        <h1>Level {currentLevel} Complete!</h1>
        <div className="card">
          <h2>{levelStructure[currentLevel - 1].name}</h2>
          <p>You scored {score} out of {questions.length}!</p>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${(score / questions.length) * 100}%` }}
            ></div>
          </div>
          <button onClick={nextLevel}>
            {currentLevel < levelStructure.length ? "Next Level" : "See Final Results"}
          </button>
        </div>
      </div>
    );
  }

  // Check if we have questions and the current question exists
  if (!questions.length || !questions[currentQuestionIndex]) {
    return (
      <div className="container">
        <h1>Level {currentLevel} - {levelStructure[currentLevel - 1].name}</h1>
        <p className="error-message">No questions available. Please try again.</p>
        <button onClick={() => generateQuestionsForLevel(currentLevel)}>Try Again</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const levelInfo = levelStructure[currentLevel - 1];

  return (
    <div className="container">
      <h1>Level {currentLevel} - {levelInfo.name}</h1>
      <p>{levelInfo.description}</p>
      
      <div className="card">
        <div className="question-counter">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        
        <h2>{currentQuestion.question}</h2>
        
        {currentQuestion.type === "identification" && (
          <div className="display-item">
            <h3>{currentQuestion.display}</h3>
            <div className="options-container">
              {currentQuestion.options.map((option, index) => (
                <div 
                  key={index} 
                  className={`option ${userAnswer === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {currentQuestion.type === "reading_spelling" && (
          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <div 
                key={index} 
                className={`option ${userAnswer === option ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
        
        {currentQuestion.type === "math_problem" && (
          <div className="answer-input">
            <input
              type="text"
              value={userAnswer}
              onChange={handleAnswerChange}
              placeholder="Enter your answer"
            />
          </div>
        )}
        
        <button onClick={checkAnswer} disabled={!userAnswer}>
          Check Answer
        </button>
        
        {result && (
          <div className={`result ${result.includes("Correct") ? "success" : "error"}`}>
            {result}
          </div>
        )}
        
        {showImage && (
          <div className="feedback-image">
            <img 
              src={isCorrect ? "/correctanswerimage.jpeg" : "/wronganswerimage.jpeg"} 
              alt={isCorrect ? "Correct" : "Incorrect"} 
            />
          </div>
        )}
        
        <div className="score-container">
          <p>Current Score: {score}/{currentQuestionIndex + 1}</p>
        </div>
      </div>
    </div>
  );
};

export default LevelTest; 