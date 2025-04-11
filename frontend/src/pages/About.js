import React, { useState } from "react";

const About = () => {
  const [info, setInfo] = useState("This app provides tools and resources for individuals with dyslexia.");

  const showMore = () => {
    setInfo("We aim to enhance reading and learning experiences through innovative assistive technology.");
  };

  return (
    <div>
      <h1>About This Project</h1>
      <p>{info}</p>
      <button onClick={showMore}>Learn More</button>

      <h2>Our Mission</h2>
      <p>We strive to create a supportive environment for dyslexic individuals by leveraging technology.</p>

      <h2>Meet the Team</h2>
      <ul>
        <li>22251A1234-Srinija Abburi</li>
        <li>22251A1235-Shivani Bandi</li>
        <li>22251A1236-Vrindha Baswa</li>
      </ul>
    </div>
  );
};

export default About;
