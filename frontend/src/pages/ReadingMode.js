import React, { useState, useEffect } from "react";
import axios from "axios";

const ReadingMode = () => {
  const [fontSize, setFontSize] = useState(18);
  const [letterSpacing, setLetterSpacing] = useState(1);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [currentSentence, setCurrentSentence] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      fetchNewSentence();
    }
  }, [token]);

  const fetchNewSentence = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:3000/reading", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Received sentence:", response.data.sentence);
      setCurrentSentence(response.data.sentence);
    } catch (err) {
      setError("Failed to fetch sentence. Please try again or log in.");
      console.error("Error fetching sentence:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: bgColor, padding: "20px", minHeight: "100vh", textAlign: "center" }}>
      <h2 style={{ fontSize: `${fontSize}px`, letterSpacing: `${letterSpacing}px` }}>
        Dyslexia-Friendly Reading Mode
      </h2>
      
      {loading ? (
        <p>Loading sentence...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <p style={{ fontSize: `${fontSize}px`, letterSpacing: `${letterSpacing}px`, borderBottom: "2px solid black", display: "inline-block", padding: "10px" }}>
          {currentSentence}
        </p>
      )}

      <br />
      <button onClick={fetchNewSentence} style={styles.button} disabled={loading}>
        {loading ? "Loading..." : "New Sentence"}
      </button>

      <div style={styles.controls}>
        <label>Font Size:</label>
        <input type="range" min="16" max="32" value={fontSize} onChange={(e) => setFontSize(e.target.value)} />

        <label>Letter Spacing:</label>
        <input type="range" min="0" max="5" value={letterSpacing} onChange={(e) => setLetterSpacing(e.target.value)} />

        <label>Background Color:</label>
        <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
      </div>
    </div>
  );
};

// Styles for UI elements
const styles = {
  button: {
    padding: "10px 15px",
    fontSize: "16px",
    margin: "10px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
  },
  controls: {
    marginTop: "20px",
  }
};

export default ReadingMode;
