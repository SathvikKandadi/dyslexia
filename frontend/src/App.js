import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ReadingMode from "./pages/ReadingMode";
import Exercises from "./pages/Exercises";
import Features from "./pages/Features";
import Test from "./pages/Test";
import NumberAlphabetTest from "./pages/NumberAlphabetTest";
import Dashboard from "./pages/Dashboard";
import ReadingTest from "./pages/ReadingTest";
import SpellCheck from "./pages/SpellCheck";
import MathQuiz from "./pages/MathQuiz";
import LevelTest from "./pages/LevelTest";
import "./App.css";

// Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();
  
//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }
  
//   return children;
// };

function App() {
  // const { isAuthenticated } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="content-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/features" element={<Features />} />
              <Route path="/exercises" element={<Exercises />} />
              <Route path="/reading-mode" element={<ReadingMode />} />
              <Route path="/test" element={<Test />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/number-alphabet-test" element={<NumberAlphabetTest />} />
              <Route path="/reading-test" element={<ReadingTest />} />
              <Route path="/spell-check" element={<SpellCheck />} />
              <Route path="/math-quiz" element={<MathQuiz />} />
              <Route path="/level-test" element={<LevelTest />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
