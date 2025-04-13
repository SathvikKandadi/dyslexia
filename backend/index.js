const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const OpenAI = require('openai');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Connect to MongoDB with modern options
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  // Don't exit the process, just log the error
  // This allows the server to start even if MongoDB connection fails
  // You can implement a retry mechanism here if needed
});

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Progress Schema
const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exercisesCompleted: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  levelsCompleted: { type: Number, default: 0 },
  testHistory: [{
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['Reading', 'Spelling', 'Math', 'Level Test'] },
    level: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    skillName: { type: String, default: '' }
  }]
});

const Progress = mongoose.model('Progress', progressSchema);

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Invalid token format.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired. Please log in again.' });
      }
      return res.status(403).json({ message: 'Invalid token. Please log in again.' });
    }
    req.user = user;
    next();
  });
};

// Signup endpoint
app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Reading mode endpoint
app.get('/reading', authenticateToken, async (req, res) => {
  try {
    console.log('Attempting to generate sentences with OpenAI...');
    
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not found in environment variables');
      return res.status(500).json({
        message: 'Server configuration error: OpenAI API key not found',
        error: 'OPENAI_API_KEY_MISSING'
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ 
        role: "user", 
        content: `Generate 50 unique, simple sentences suitable for children with dyslexia to read. 
        Each sentence should:
        1. Be short (5-8 words)
        2. Use basic vocabulary
        3. Be easy to understand
        4. Be appropriate for children
        
        Format the response as a JSON array of sentences.
        Example format: ["The cat sits on the mat.", "A boy runs in the park.", ...]`
      }]
    }).catch(error => {
      console.error('OpenAI API Error:', {
        status: error.status,
        message: error.message,
        type: error.type
      });
      throw error;
    });

    console.log('OpenAI response received');

    try {
      const sentences = JSON.parse(completion.choices[0].message.content);
      if (Array.isArray(sentences) && sentences.length > 0) {
        console.log(`Successfully generated ${sentences.length} sentences`);
        res.json({ sentences });
      } else {
        console.error('Invalid response format from OpenAI:', completion.choices[0].message.content);
        throw new Error('Invalid response format from OpenAI');
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.log('Falling back to predefined sentences');
      
      // Fallback sentences if parsing fails
      const fallbackSentences = [
        "The cat sits on the mat.",
        "I like to play games.",
        "The sun is very bright.",
        "Birds fly in the sky.",
        "She reads a good book.",
        "The dog runs in the park.",
        "He drinks cold water.",
        "The fish swims in water.",
        "We go to school today.",
        "The car is very fast."
      ];
      res.json({ 
        sentences: fallbackSentences,
        source: 'fallback'
      });
    }
  } catch (error) {
    console.error('Error in reading endpoint:', {
      name: error.name,
      message: error.message,
      status: error.status,
      type: error.type
    });

    if (error.status === 401) {
      res.status(401).json({
        message: 'OpenAI API key is invalid',
        error: 'INVALID_API_KEY'
      });
    } else if (error.status === 429) {
      res.status(429).json({
        message: 'OpenAI API rate limit exceeded',
        error: 'RATE_LIMIT_EXCEEDED'
      });
    } else if (error.status === 500) {
      res.status(500).json({
        message: 'OpenAI API server error',
        error: 'OPENAI_SERVER_ERROR'
      });
    } else {
      res.status(500).json({ 
        message: 'Error generating sentences',
        error: error.message
      });
    }
  }
});

// Simple word categories for spell check
const simpleWords = {
  fruits: [
    { word: "apple", options: ["apple", "aple", "appel", "appl"] },
    { word: "pear", options: ["pear", "pare", "peer", "per"] },
    { word: "plum", options: ["plum", "plam", "plom", "plumb"] },
    { word: "fig", options: ["fig", "feg", "figg", "fige"] },
    { word: "lime", options: ["lime", "lyme", "liem", "liym"] }
  ],
  animals: [
    { word: "cat", options: ["cat", "kat", "catt", "cet"] },
    { word: "dog", options: ["dog", "dug", "dogg", "dawg"] },
    { word: "bird", options: ["bird", "berd", "burd", "birrd"] },
    { word: "fish", options: ["fish", "fich", "phish", "fissh"] },
    { word: "rat", options: ["rat", "ret", "ratt", "wrat"] }
  ],
  vehicles: [
    { word: "car", options: ["car", "kar", "carr", "caar"] },
    { word: "bus", options: ["bus", "bas", "buss", "buus"] },
    { word: "bike", options: ["bike", "bik", "byke", "biek"] },
    { word: "van", options: ["van", "ven", "vann", "vhan"] },
    { word: "ship", options: ["ship", "shep", "shipp", "shiip"] }
  ],
  places: [
    { word: "home", options: ["home", "hom", "hoam", "hoem"] },
    { word: "park", options: ["park", "pak", "parc", "prak"] },
    { word: "shop", options: ["shop", "shup", "shopp", "chop"] },
    { word: "mall", options: ["mall", "mal", "moll", "maul"] },
    { word: "gym", options: ["gym", "jim", "gim", "jym"] }
  ]
};

// Function to shuffle array
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Function to generate misspellings for a word
function generateMisspellings(word) {
  const misspellings = [];
  
  // Common misspelling patterns
  if (word.length > 3) {
    // Double a letter
    const doubleLetterIndex = Math.floor(Math.random() * (word.length - 1));
    misspellings.push(word.substring(0, doubleLetterIndex) + word[doubleLetterIndex] + word.substring(doubleLetterIndex));
    
    // Remove a letter
    const removeLetterIndex = Math.floor(Math.random() * word.length);
    misspellings.push(word.substring(0, removeLetterIndex) + word.substring(removeLetterIndex + 1));
  }
  
  // If we don't have enough misspellings, add some generic ones
  while (misspellings.length < 2) {
    // Add a random letter
    const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    const randomIndex = Math.floor(Math.random() * (word.length + 1));
    misspellings.push(word.substring(0, randomIndex) + randomLetter + word.substring(randomIndex));
  }
  
  return misspellings;
}

// Function to generate fallback words
function generateFallbackWords() {
  const allWords = [];
  
  // Get words from each category in simpleWords
  Object.entries(simpleWords).forEach(([category, words]) => {
    words.forEach(word => {
      allWords.push({
        correct: word.word,
        category: category.slice(0, -1), // Remove 's' from category name
        options: shuffleArray([...word.options]) // Make a copy and shuffle
      });
    });
  });

  // Additional words
  const baseWords = [
    { word: "blue", category: "color", options: ["blue", "bloo", "blew", "blu"] },
    { word: "red", category: "color", options: ["red", "rad", "rid", "reed"] },
    { word: "cake", category: "food", options: ["cake", "kake", "caik", "cayke"] },
    { word: "rain", category: "weather", options: ["rain", "rane", "rayn", "rein"] },
    { word: "snow", category: "weather", options: ["snow", "snoe", "snoo", "sno"] },
    { word: "hat", category: "clothing", options: ["hat", "het", "hatt", "haat"] },
    { word: "coat", category: "clothing", options: ["coat", "cote", "cout", "koat"] }
  ];

  baseWords.forEach(({ word, category, options }) => {
    allWords.push({
      correct: word,
      category,
      options: shuffleArray([...options]) // Make a copy and shuffle
    });
  });

  // Return 50 words or all available words if less than 50
  return shuffleArray(allWords).slice(0, 50);
}

// Spell check endpoint
app.get('/spellcheck', authenticateToken, (req, res) => {
  try {
    // Get words from simpleWords
    const allWords = [];
    
    // Process each category
    Object.entries(simpleWords).forEach(([category, words]) => {
      words.forEach(word => {
        // Ensure we have exactly 4 options
        const options = [...word.options];
        if (options.length > 4) {
          options.length = 4;
        }
        while (options.length < 4) {
          options.push(word.word + Math.random().toString(36).substr(2, 2));
        }
        
        allWords.push({
          correct: word.word,
          category: category.slice(0, -1), // Remove 's' from category name
          options: shuffleArray(options)
        });
      });
    });

    // Add additional words
    const additionalWords = [
      { word: "blue", category: "color", options: ["blue", "bloo", "blew", "blu"] },
      { word: "red", category: "color", options: ["red", "rad", "rid", "reed"] },
      { word: "cake", category: "food", options: ["cake", "kake", "caik", "cayke"] },
      { word: "rain", category: "weather", options: ["rain", "rane", "rayn", "rein"] },
      { word: "snow", category: "weather", options: ["snow", "snoe", "snoo", "sno"] },
      { word: "hat", category: "clothing", options: ["hat", "het", "hatt", "haat"] },
      { word: "coat", category: "clothing", options: ["coat", "cote", "cout", "koat"] }
    ];

    additionalWords.forEach(({ word, category, options }) => {
      allWords.push({
        correct: word,
        category,
        options: shuffleArray([...options])
      });
    });

    // Shuffle and limit to 50 words
    const finalWords = shuffleArray(allWords).slice(0, 50);

    // Validate the response before sending
    const validWords = finalWords.filter(word => 
      word && 
      typeof word.correct === 'string' && 
      typeof word.category === 'string' && 
      Array.isArray(word.options) && 
      word.options.length === 4 &&
      word.options.includes(word.correct)
    );

    if (validWords.length === 0) {
      console.error('No valid words generated');
      return res.status(500).json({
        message: 'Failed to generate valid words',
        error: 'NO_VALID_WORDS'
      });
    }

    // Log what we're sending
    console.log('Sending response:', {
      wordCount: validWords.length,
      sampleWord: validWords[0]
    });

    // Send the response with the words array
    return res.json({
      words: validWords,
      count: validWords.length
    });

  } catch (error) {
    console.error('Error in spellcheck endpoint:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Math quiz endpoint
app.post('/math-quiz', authenticateToken, (req, res) => {
  try {
    console.log('Generating math questions...');
    
    // Generate 50 unique math questions
    const questions = [];
    const operations = ['+', '-', '×', '÷'];
    const usedQuestions = new Set();

    while (questions.length < 50) {
      const operation = operations[Math.floor(Math.random() * operations.length)];
      let num1, num2, answer, question;

      switch (operation) {
        case '+':
          num1 = Math.floor(Math.random() * 20) + 1;
          num2 = Math.floor(Math.random() * 20) + 1;
          answer = num1 + num2;
          question = `What is ${num1} + ${num2}?`;
          break;
        case '-':
          num1 = Math.floor(Math.random() * 20) + 1;
          num2 = Math.floor(Math.random() * num1) + 1;
          answer = num1 - num2;
          question = `What is ${num1} - ${num2}?`;
          break;
        case '×':
          num1 = Math.floor(Math.random() * 10) + 1;
          num2 = Math.floor(Math.random() * 10) + 1;
          answer = num1 * num2;
          question = `What is ${num1} × ${num2}?`;
          break;
        case '÷':
          num2 = Math.floor(Math.random() * 9) + 1;
          answer = Math.floor(Math.random() * 10) + 1;
          num1 = num2 * answer;
          question = `What is ${num1} ÷ ${num2}?`;
          break;
      }

      const questionKey = `${question}-${answer}`;
      
      if (!usedQuestions.has(questionKey)) {
        usedQuestions.add(questionKey);
        questions.push({
          question,
          answer: answer.toString(),
          type: 'math',
          difficulty: operation === '×' || operation === '÷' ? 'medium' : 'easy'
        });
      }
    }

    // Shuffle the questions
    const shuffledQuestions = questions.sort(() => Math.random() - 0.5);

    console.log('Sending response:', {
      questionCount: shuffledQuestions.length,
      sampleQuestion: shuffledQuestions[0]
    });

    // Make sure we're sending the correct format
    return res.json({
      questions: shuffledQuestions,
      count: shuffledQuestions.length
    });

  } catch (error) {
    console.error('Error generating math questions:', error);
    return res.status(500).json({ 
      message: 'Error generating math questions', 
      error: error.message 
    });
  }
});

// Dashboard Routes
app.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching dashboard data for user:', req.user.userId);
    const progress = await Progress.findOne({ userId: req.user.userId });
    
    if (!progress) {
      console.log('No progress found, creating new record');
      // Create new progress record if none exists
      const newProgress = new Progress({ 
        userId: req.user.userId,
        exercisesCompleted: 0,
        correctAnswers: 0,
        totalQuestions: 0,
        levelsCompleted: 0,
        testHistory: []
      });
      await newProgress.save();
      return res.json(newProgress);
    }
    
    console.log('Found existing progress:', progress);
    res.json(progress);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ 
      message: 'Failed to fetch dashboard data',
      error: error.message 
    });
  }
});

app.post('/dashboard/update', authenticateToken, async (req, res) => {
  try {
    const { exerciseType, score, skillName, correct, total, level, isLevelComplete, isExerciseComplete = false } = req.body;
    
    console.log('Updating dashboard for user:', req.user.userId);
    console.log('Update data:', { exerciseType, score, skillName, correct, total, level });
    
    // Get the user's progress document
    let progress = await Progress.findOne({ userId: req.user.userId });
    
    if (!progress) {
      console.log('No existing progress found, creating new record');
      progress = new Progress({
        userId: req.user.userId,
        exercisesCompleted: 0,
        correctAnswers: 0,
        totalQuestions: 0,
        levelsCompleted: 0,
        testHistory: []
      });
    } else {
      console.log('Found existing progress:', {
        userId: progress.userId,
        correctAnswers: progress.correctAnswers,
        totalQuestions: progress.totalQuestions
      });
    }

    // Only update overall stats if this is not a duplicate update
    if (!isExerciseComplete) {
      progress.correctAnswers += correct;
      progress.totalQuestions += total;
      console.log('Updated stats:', {
        newCorrectAnswers: progress.correctAnswers,
        newTotalQuestions: progress.totalQuestions
      });
    }

    // Add to test history
    const historyEntry = {
      date: new Date(),
      type: exerciseType,
      score: score,
      skillName: skillName,
      accuracy: (correct / total) * 100,
      level: level,
      totalQuestions: total,
      correctAnswers: correct
    };
    progress.testHistory.push(historyEntry);
    console.log('Added history entry:', historyEntry);

    // Update levels completed if this is a level completion
    if (isLevelComplete && level > progress.levelsCompleted) {
      progress.levelsCompleted = level;
      console.log('Updated levels completed to:', level);
    }

    await progress.save();
    console.log('Progress saved successfully');
    res.json({ message: 'Progress updated successfully' });
  } catch (err) {
    console.error('Error updating progress:', err);
    res.status(500).json({ 
      message: 'Failed to update progress',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

app.listen(3000, () => {
  console.log("App started in port 3000");
});

