import React from "react";

const Features = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Features of Dyslexia Aid</h1>
      <ul style={styles.list}>
        <li>📖 Customizable Reading Mode</li>
        <li>📝 Interactive Learning Exercises</li>
        <li>🔊 Text-to-Speech Converter (Coming Soon)</li>
      </ul>
    </div>
  );
};

// Inline Styles
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
  list: {
    listStyleType: "none",
    padding: 0,
    fontSize: "18px",
  },
};

export default Features;
