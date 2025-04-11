import React, { useState } from "react";

const TextToSpeech = () => {
  const [text, setText] = useState("");

  const speak = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US"; // You can change this to other languages
      speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn't support text-to-speech!");
    }
  };

  return (
    <div className="container">
      <h2>Text-to-Speech Converter</h2>
      <textarea
        rows="4"
        cols="50"
        placeholder="Type something here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "5px",
        }}
      />
      <button onClick={speak} style={{ marginTop: "10px" }}>Speak</button>
    </div>
  );
};

export default TextToSpeech;
