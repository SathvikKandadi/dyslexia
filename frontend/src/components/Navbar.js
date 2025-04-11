import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css"; // Add styles later if needed

function Navbar() {
  const [showPracticeDropdown, setShowPracticeDropdown] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const togglePracticeDropdown = () => {
    setShowPracticeDropdown(!showPracticeDropdown);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/">Dyslexia Helper</Link>
        </div>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          
          {isAuthenticated ? (
            <>
              <li className="nav-item dropdown">
                <div 
                  className="nav-link dropdown-toggle" 
                  onClick={togglePracticeDropdown}
                >
                  Practice
                  <span className="dropdown-arrow">▼</span>
                </div>
                {showPracticeDropdown && (
                  <ul className="dropdown-menu">
                    <li className="dropdown-item">
                      <Link to="/reading-test" className="dropdown-link">Reading Test</Link>
                    </li>
                    <li className="dropdown-item">
                      <Link to="/spell-check" className="dropdown-link">Spell Check</Link>
                    </li>
                    <li className="dropdown-item">
                      <Link to="/math-quiz" className="dropdown-link">Math Quiz</Link>
                    </li>
                  </ul>
                )}
              </li>
              <li className="nav-item">
                <Link to="/exercises" className="nav-link">Exercises</Link>
              </li>
              <li className="nav-item">
                <Link to="/level-test" className="nav-link">Skill Assessment</Link>
              </li>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/about" className="nav-link">About</Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/signup" className="nav-link">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
