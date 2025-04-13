import React, { useState, useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
} from "chart.js";
import axios from "axios";

// Register Chart.js Components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

const Dashboard = () => {
  const [progress, setProgress] = useState({
    correctAnswers: 0,
    totalQuestions: 0,
    levelsCompleted: 0,
  });

  const [testHistory, setTestHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your dashboard");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:3000/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = response.data;
        setProgress({
          correctAnswers: data.correctAnswers || 0,
          totalQuestions: data.totalQuestions || 0,
          levelsCompleted: data.levelsCompleted || 0,
        });

        // Sort test history by date in descending order
        const sortedHistory = [...(data.testHistory || [])].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setTestHistory(sortedHistory);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const accuracy = progress.totalQuestions > 0 ? (progress.correctAnswers / progress.totalQuestions) * 100 : 0;
  const wrongAnswers = progress.totalQuestions - progress.correctAnswers;

  // Filter completed level tests
  const completedLevelTests = testHistory
    .filter(test => test.type === 'Level Test' && test.skillName.includes('Complete'))
    .map(test => ({
      ...test,
      level: test.level || 0,
      score: test.score || 0,
      accuracy: test.accuracy || 0
    }));

  // Get practice exercise stats (Spelling and Math only)
  const practiceStats = testHistory
    .filter(test => test.type === 'Spelling' || test.type === 'Math')
    .reduce((acc, test) => {
      acc.totalQuestions += test.totalQuestions || 0;
      acc.correctAnswers += test.correctAnswers || 0;
      return acc;
    }, { totalQuestions: 0, correctAnswers: 0 });

  // 📊 Pie Chart Data for Exercise Accuracy
  const pieData = {
    labels: ["Correct Answers", "Wrong Answers"],
    datasets: [
      {
        data: [progress.correctAnswers, wrongAnswers],
        backgroundColor: ["#4CAF50", "#FF5733"],
        hoverBackgroundColor: ["#45a049", "#ff453a"],
      },
    ],
  };

  // Configure the bar chart data for level scores
  const levelScoreData = {
    labels: completedLevelTests.map(test => `Level ${test.level} (${test.level === 1 ? 'Easy' : test.level === 2 ? 'Medium' : 'Hard'})`),
    datasets: [
      {
        label: 'Score',
        data: completedLevelTests.map(test => test.score),
        backgroundColor: '#4CAF50',
        borderColor: '#45a049',
        borderWidth: 1,
      }
    ]
  };

  // Configure the bar chart data for level accuracy
  const levelAccuracyData = {
    labels: completedLevelTests.map(test => `Level ${test.level} (${test.level === 1 ? 'Easy' : test.level === 2 ? 'Medium' : 'Hard'})`),
    datasets: [
      {
        label: 'Accuracy',
        data: completedLevelTests.map(test => test.accuracy),
        backgroundColor: '#2196F3',
        borderColor: '#1976D2',
        borderWidth: 1,
      }
    ]
  };

  // Bar chart options for score
  const scoreChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        title: {
          display: true,
          text: 'Score (out of 5)'
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Level Scores'
      }
    }
  };

  // Bar chart options for accuracy
  const accuracyChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Accuracy (%)'
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Level Accuracy'
      }
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h1>Loading Dashboard...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1>Error</h1>
        <p>{error}</p>
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
            <span className="stat-label">Total Questions Attempted:</span>
            <span className="stat-value">{progress.totalQuestions}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Correct Answers:</span>
            <span className="stat-value">{progress.correctAnswers}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Wrong Answers:</span>
            <span className="stat-value">{wrongAnswers}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Overall Accuracy:</span>
            <span className="stat-value">{accuracy.toFixed(1)}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Levels Completed:</span>
            <span className="stat-value">{progress.levelsCompleted}</span>
          </div>
        </div>

        <div className="card">
          <h3>Level Progress</h3>
          {completedLevelTests.length > 0 ? (
            <>
              <div className="chart-container">
                <Bar data={levelScoreData} options={scoreChartOptions} />
              </div>
              <div className="chart-container" style={{ marginTop: '20px' }}>
                <Bar data={levelAccuracyData} options={accuracyChartOptions} />
              </div>
              <div className="level-progress">
                {completedLevelTests.map((test, index) => (
                  <div key={index} className="level-item">
                    <h4>Level {test.level} ({test.level === 1 ? 'Easy' : test.level === 2 ? 'Medium' : 'Hard'})</h4>
                    <div className="level-stats">
                      <div className="stat-item">
                        <span className="stat-label">Score:</span>
                        <span className="stat-value">{test.score}/5</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Accuracy:</span>
                        <span className="stat-value">{test.accuracy.toFixed(1)}%</span>
                      </div>
                      <div className="completion-date">
                        Completed: {new Date(test.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>No levels completed yet. Complete a level test to see your progress!</p>
          )}
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>✅ Practice Exercise Accuracy</h3>
          <Pie data={pieData} />
          <p className="chart-description">
            Shows the ratio of correct vs wrong answers in spelling and math exercises
          </p>
        </div>

        <div className="card">
          <h3>Recent Activity</h3>
          {testHistory.length > 0 ? (
            <div className="activity-list">
              {testHistory.slice(0, 5).map((test, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-date">
                    {new Date(test.date).toLocaleDateString()}
                  </div>
                  <div className="activity-type">{test.type}</div>
                  {test.type === 'Level Test' ? (
                    <>
                      <div className="activity-level">Level {test.level}</div>
                      <div className="activity-score">
                        Score: {test.score}/5
                      </div>
                      <div className="activity-accuracy">
                        Accuracy: {test.accuracy.toFixed(1)}%
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="activity-score">
                        Score: {test.score}/5
                      </div>
                      <div className="activity-accuracy">
                        Accuracy: {test.accuracy.toFixed(1)}%
                      </div>
                    </>
                  )}
                  {test.skillName && (
                    <div className="activity-skill">{test.skillName}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No recent activity. Complete some exercises to see your progress!</p>
          )}
        </div>
      </div>

      <div className="card">
        <h3>🎯 Next Steps</h3>
        <div className="next-steps">
          <div className="recommendations">
            <h4>Level Test Progress:</h4>
            <ul>
              {completedLevelTests.length === 0 ? (
                <li>Start with Level 1 test to establish your baseline</li>
              ) : (
                <>
                  {progress.levelsCompleted < 3 && (
                    <li>Continue to Level {progress.levelsCompleted + 1} test</li>
                  )}
                  {completedLevelTests[completedLevelTests.length - 1]?.score < 4 && (
                    <li>Practice more to improve your current level score</li>
                  )}
                  {progress.levelsCompleted === 3 && (
                    <li>Great job completing all levels! Keep practicing to maintain your skills</li>
                  )}
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
