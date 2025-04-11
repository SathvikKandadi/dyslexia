import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const Home = () => {
  const [fontSize, setFontSize] = useState(16);
  const [letterSpacing, setLetterSpacing] = useState(1);
  const [bgColor, setBgColor] = useState("#ffffff");
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const features = [
    {
      title: "Practice Exercises",
      description: "Improve your reading and writing skills with interactive exercises designed for dyslexic individuals.",
      icon: "📚",
      link: "/exercises"
    },
    {
      title: "Skill Assessment",
      description: "Take a comprehensive test to assess your current skill level and track your progress over time.",
      icon: "📊",
      link: "/level-test"
    },
    {
      title: "Reading Tools",
      description: "Access tools that make reading easier, including text-to-speech and customizable text formatting.",
      icon: "🔍",
      link: "/reading-mode"
    },
    {
      title: "Progress Dashboard",
      description: "View your progress, track completed exercises, and see your improvement over time.",
      icon: "📈",
      link: "/dashboard"
    }
  ];

  const isActiveFeature = (link) => {
    return location.pathname === link;
  };

  return (
    <div className="home-container" style={{ backgroundColor: bgColor }}>
      <div className="hero-section">
        <h1 style={{ fontSize: `${fontSize}px`, letterSpacing: `${letterSpacing}px` }}>
          Welcome to Dyslexia Helper
        </h1>
        <p style={{ fontSize: `${fontSize - 2}px`, letterSpacing: `${letterSpacing}px` }}>
          Helping individuals with dyslexia through various tools and exercises.
        </p>
        
        {!isAuthenticated && (
          <div className="auth-buttons">
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
          </div>
        )}
      </div>

      <div className="accessibility-controls">
        <div className="control-group">
          <label>Font Size: </label>
          <button onClick={() => setFontSize(fontSize + 2)}>➕ Increase</button>
          <button onClick={() => setFontSize(fontSize - 2)}>➖ Decrease</button>
        </div>

        <div className="control-group">
          <label>Letter Spacing: </label>
          <button onClick={() => setLetterSpacing(letterSpacing + 0.5)}>➕ Increase</button>
          <button onClick={() => setLetterSpacing(letterSpacing - 0.5)}>➖ Decrease</button>
        </div>

        <div className="control-group">
          <label>Background Color: </label>
          <button onClick={() => setBgColor("#f0f8ff")}>🔵 Blue</button>
          <button onClick={() => setBgColor("#ffebcd")}>🟠 Beige</button>
          <button onClick={() => setBgColor("#ffffff")}>⚪ Default</button>
        </div>
      </div>

      {isAuthenticated && (
        <div className="features-section">
          <h2>Our Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <Link 
                to={feature.link} 
                key={index} 
                className={`feature-card ${isActiveFeature(feature.link) ? 'active' : ''}`}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="about-section">
        <h2>About Dyslexia Helper</h2>
        <p>
          Dyslexia Helper is designed to support individuals with dyslexia through various tools and exercises.
          Our platform provides a range of features to help improve reading, writing, and comprehension skills.
        </p>
        <p>
          Whether you're a student, professional, or someone looking to improve your skills,
          our tools are designed to make learning more accessible and enjoyable.
        </p>
        <div className="team-section">
          <h3>Our Team</h3>
          <ul>
            <li>22251A1234 - Srinija Abburi</li>
            <li>22251A1235 - Shivani Bandi</li>
            <li>22251A1236 - Vrindha Baswa</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
