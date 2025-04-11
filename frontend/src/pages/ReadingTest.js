import React, { useState, useEffect } from "react";
import axios from "axios";

const ReadingTest = () => {
  const [sentences, setSentences] = useState([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [letterSpacing, setLetterSpacing] = useState(1);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      // Check if we have sentences in localStorage
      const storedSentences = localStorage.getItem("readingTestSentences");
      if (storedSentences) {
        try {
          const parsedSentences = JSON.parse(storedSentences);
          if (Array.isArray(parsedSentences) && parsedSentences.length > 0) {
            setSentences(parsedSentences);
          } else {
            console.log("Invalid stored sentences format, fetching new ones");
            fetchNewSentences();
          }
        } catch (err) {
          console.error("Error parsing stored sentences:", err);
          fetchNewSentences();
        }
      } else {
        fetchNewSentences();
      }
    } else {
      setError("Please log in to access this feature.");
    }
  }, [token]);

  const fetchNewSentences = async () => {
    setLoading(true);
    setError("");
    try {
      // Validate token
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Fetching sentences with token:", token.substring(0, 20) + "...");
      
      const response = await axios.get("http://localhost:3000/reading", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("Response from server:", {
        status: response.status,
        headers: response.headers,
        data: response.data
      });
      
      if (response.data.sentences && Array.isArray(response.data.sentences) && response.data.sentences.length > 0) {
        setSentences(response.data.sentences);
        setCurrentSentenceIndex(0);
        // Store sentences in localStorage
        localStorage.setItem("readingTestSentences", JSON.stringify(response.data.sentences));
      } else {
        console.error("Invalid response format:", response.data);
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.error("Detailed error:", {
        name: err.name,
        message: err.message,
        response: {
          status: err.response?.status,
          data: err.response?.data,
          headers: err.response?.headers
        },
        request: err.request ? 'Request was made but no response received' : 'Request setup failed'
      });
      
      if (!err.response) {
        setError("Network error: Could not connect to the server. Please check your internet connection.");
      } else if (err.response.status === 401) {
        setError("Your session has expired. Please log out and log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("readingTestSentences");
      } else if (err.response.status === 403) {
        setError("Access denied. Please check your login credentials.");
      } else if (err.response.status === 500) {
        setError("Server error: Could not generate sentences. Please try again later.");
      } else if (err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again or contact support.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGetNewSentence = () => {
    if (!token) {
      setError("Please log in to access this feature.");
      return;
    }

    if (sentences.length === 0) {
      fetchNewSentences();
      return;
    }

    // Move to the next sentence or loop back to the beginning
    setCurrentSentenceIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= sentences.length) {
        // If we've reached the end, fetch new sentences
        fetchNewSentences();
        return 0;
      }
      return nextIndex;
    });
  };

  // Clear sentences from localStorage on logout
  const clearSentences = () => {
    localStorage.removeItem("readingTestSentences");
    setSentences([]);
    setCurrentSentenceIndex(0);
  };

  return (
    <div className="container">
      <h1>Reading Test</h1>
      <p>Practice reading sentences with customizable settings to help with dyslexia.</p>
      
      <div className="card" style={{ backgroundColor: bgColor, padding: "20px", marginBottom: "20px" }}>
        {loading ? (
          <p>Loading sentences...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : sentences.length > 0 ? (
          <p style={{ 
            fontSize: `${fontSize}px`, 
            letterSpacing: `${letterSpacing}px`,
            lineHeight: "1.6",
            textAlign: "center",
            padding: "20px",
            borderBottom: "2px solid #3498db",
            margin: "0 auto",
            maxWidth: "80%"
          }}>
            {sentences[currentSentenceIndex]}
          </p>
        ) : (
          <p>No sentences available. Click "Get New Sentence" to start.</p>
        )}
      </div>

      <div className="card">
        <h3>Customize Your Reading Experience</h3>
        <div className="control-group">
          <label>Font Size:</label>
          <input 
            type="range" 
            min="16" 
            max="32" 
            value={fontSize} 
            onChange={(e) => setFontSize(parseInt(e.target.value))} 
          />
          <span>{fontSize}px</span>
        </div>

        <div className="control-group">
          <label>Letter Spacing:</label>
          <input 
            type="range" 
            min="0" 
            max="5" 
            value={letterSpacing} 
            onChange={(e) => setLetterSpacing(parseFloat(e.target.value))} 
          />
          <span>{letterSpacing}px</span>
        </div>

        <div className="control-group">
          <label>Background Color:</label>
          <input 
            type="color" 
            value={bgColor} 
            onChange={(e) => setBgColor(e.target.value)} 
          />
        </div>
      </div>

      <button onClick={handleGetNewSentence} disabled={loading}>
        {loading ? "Loading..." : "Get New Sentence"}
      </button>
    </div>
  );
};

export default ReadingTest; 