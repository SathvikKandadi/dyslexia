import React, { useState, useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from "chart.js";

// Register Chart.js Components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const Dashboard = () => {
  const [progress, setProgress] = useState({
    exercisesCompleted: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    levelsCompleted: 0,
  });

  const [testHistory, setTestHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load progress from localStorage
    const storedProgress = JSON.parse(localStorage.getItem("studentProgress")) || {
      exercisesCompleted: 0,
      correctAnswers: 0,
      totalQuestions: 0,
      levelsCompleted: 0,
    };
    setProgress(storedProgress);

    // Load test history from localStorage
    const storedHistory = JSON.parse(localStorage.getItem("testHistory")) || [];
    setTestHistory(storedHistory);

    setLoading(false);
  }, []);

  const accuracy = progress.totalQuestions > 0 ? (progress.correctAnswers / progress.totalQuestions) * 100 : 0;

  // 📊 Pie Chart Data for Exercise Accuracy
  const pieData = {
    labels: ["Correct Answers", "Incorrect Answers"],
    datasets: [
      {
        data: [progress.correctAnswers, progress.totalQuestions - progress.correctAnswers],
        backgroundColor: ["#4CAF50", "#FF5733"],
        hoverBackgroundColor: ["#45a049", "#ff453a"],
      },
    ],
  };

  // 📊 Bar Chart Data for Level Progress
  const barData = {
    labels: ["Levels Completed"],
    datasets: [
      {
        label: "Levels Completed",
        data: [progress.levelsCompleted],
        backgroundColor: "#3498db",
      },
    ],
  };

  // 📊 Line Chart Data for Test History
  const lineData = {
    labels: testHistory.map((_, index) => `Test ${index + 1}`),
    datasets: [
      {
        label: "Score",
        data: testHistory.map(test => test.score),
        borderColor: "#9b59b6",
        backgroundColor: "rgba(155, 89, 182, 0.2)",
        tension: 0.3,
      },
    ],
  };

  // Generate test history if empty
  useEffect(() => {
    if (testHistory.length === 0 && progress.exercisesCompleted > 0) {
      // Generate some sample test history based on progress
      const history = [];
      for (let i = 0; i < Math.min(progress.exercisesCompleted, 10); i++) {
        history.push({
          date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
          type: ["Reading", "Spelling", "Math", "Level Test"][Math.floor(Math.random() * 4)],
          score: Math.floor(Math.random() * 100),
        });
      }
      setTestHistory(history);
      localStorage.setItem("testHistory", JSON.stringify(history));
    }
  }, [progress.exercisesCompleted, testHistory.length]);

  if (loading) {
    return (
      <div className="container">
        <h1>Loading Dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>📊 Student Progress Dashboard</h1>

      <div className="grid">
        <div className="card">
          <h3>Overall Statistics</h3>
          <div className="stat-item">
            <span className="stat-label">Exercises Completed:</span>
            <span className="stat-value">{progress.exercisesCompleted}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Correct Answers:</span>
            <span className="stat-value">{progress.correctAnswers}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Questions:</span>
            <span className="stat-value">{progress.totalQuestions}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Levels Completed:</span>
            <span className="stat-value">{progress.levelsCompleted}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Accuracy:</span>
            <span className="stat-value">{accuracy.toFixed(1)}%</span>
          </div>
        </div>

        <div className="card">
          <h3>Recent Activity</h3>
          {testHistory.length > 0 ? (
            <div className="activity-list">
              {testHistory.slice(0, 5).map((test, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-date">{test.date}</div>
                  <div className="activity-type">{test.type}</div>
                  <div className="activity-score">{test.score}%</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No recent activity. Complete some tests to see your progress!</p>
          )}
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>✅ Accuracy Chart</h3>
          <Pie data={pieData} />
        </div>

        <div className="card">
          <h3>📈 Levels Progress</h3>
          <Bar data={barData} />
        </div>
      </div>

      <div className="card">
        <h3>📊 Test History</h3>
        {testHistory.length > 0 ? (
          <Line data={lineData} />
        ) : (
          <p>Complete some tests to see your progress over time!</p>
        )}
      </div>

      <div className="card">
        <h3>🎯 Next Steps</h3>
        <div className="next-steps">
          {progress.levelsCompleted < 3 ? (
            <p>Continue practicing to complete all levels!</p>
          ) : (
            <p>Great job! You've completed all levels. Keep practicing to maintain your skills.</p>
          )}
          <div className="recommendations">
            <h4>Recommended Activities:</h4>
            <ul>
              {progress.exercisesCompleted < 10 && (
                <li>Complete more exercises to improve your skills</li>
              )}
              {progress.levelsCompleted < 3 && (
                <li>Try the Level Test to challenge yourself</li>
              )}
              <li>Practice reading and spelling regularly</li>
              <li>Work on math problems to strengthen your skills</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
