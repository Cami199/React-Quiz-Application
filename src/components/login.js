import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  CircularProgress,
} from "@mui/material";
import {
  Email,
  Lock,
  Login,
  Visibility,
  VisibilityOff,
  PlayCircleOutline,
  Close,
} from "@mui/icons-material";
import axios from "axios"; // For API calls

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [usernames, setUsernames] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (email === "admin@example.com" && password === "admin123") {
      navigate("/admin");
    } else {
      setError("Invalid email or password!");
    }
  };

  const handleDialogOpen = async () => {
    setDialogOpen(true);
    setLoading(true);
    try {
      // Fetch usernames from the backend
      const response = await axios.get("http://localhost:5000/api/users");
      setUsernames(response.data); // Assume response data is an array of usernames
    } catch (error) {
      console.error("Error fetching usernames:", error);
    }
    setLoading(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handlePlay = async () => {
    if (selectedName) {
      try {
        // Fetch all questions from the backend
        const response = await axios.get("http://localhost:5000/api/questions");
        const questions = response.data;
  
        // Shuffle questions to randomize their order
        const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  
        // Open a new window
        const newWindow = window.open("", "_blank", "width=800,height=600");
  
        // Write content to the new window
        newWindow.document.write(`
          <html>
            <head>
              <title>Welcome ${selectedName}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background: linear-gradient(to right, #1D2B64, #F8CDDA);
                  color: white;
                  padding: 20px;
                }
                .quiz-container {
                  max-width: 600px;
                  margin: 0 auto;
                  background: rgba(255, 255, 255, 0.1);
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                }
                h1 {
                  text-align: center;
                  font-size: 2.5rem;
                  margin-bottom: 20px;
                  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                }
                .question {
                  margin-bottom: 20px;
                }
                .question h3 {
                  font-size: 1.2rem;
                  margin-bottom: 10px;
                }
                .options {
                  display: flex;
                  flex-direction: column;
                  gap: 10px;
                }
                .option {
                  display: flex;
                  align-items: center;
                  gap: 10px;
                }
                .progress-bar {
                  width: 100%;
                  height: 10px;
                  background: #444;
                  border-radius: 5px;
                  margin-bottom: 20px;
                  overflow: hidden;
                }
                .progress {
                  height: 100%;
                  background: #6a11cb;
                  width: 0;
                  transition: width 0.3s ease;
                }
                .timer {
                  text-align: center;
                  font-size: 1.5rem;
                  margin-bottom: 20px;
                }
                .results {
                  text-align: center;
                }
                .results ul {
                  list-style: none;
                  padding: 0;
                }
                .results li {
                  margin-bottom: 10px;
                }
                .tick {
                  color: green;
                  font-weight: bold;
                }
                .cross {
                  color: red;
                  font-weight: bold;
                }
              </style>
            </head>
            <body>
              <div class="quiz-container">
                <h1>Welcome, ${selectedName}!</h1>
                <div class="timer" id="timer">Time Left: 50s</div>
                <div class="progress-bar">
                  <div class="progress"></div>
                </div>
                <div id="quiz-content"></div>
              </div>
              <script>
                const questions = ${JSON.stringify(shuffledQuestions)};
                let currentQuestionIndex = 0;
                let score = 0;
                let timeLeft = 50;
                let timer;
  
                // Function to update the progress bar
                const updateProgressBar = () => {
                  const progress = (currentQuestionIndex / questions.length) * 100;
                  document.querySelector(".progress").style.width = progress + "%";
                };
  
                // Function to start the timer
                const startTimer = () => {
                  timer = setInterval(() => {
                    timeLeft--;
                    document.getElementById("timer").textContent = "Time Left: " + timeLeft + "s";
                    if (timeLeft <= 0) {
                      clearInterval(timer);
                      endQuiz();
                    }
                  }, 1000);
                };
  
                // Function to send the final score to the backend
                const sendScoreToBackend = async (username, score) => {
                  try {
                    await fetch("http://localhost:5000/api/save-score", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ username, score }),
                    });
                  } catch (error) {
                    console.error("Error saving score:", error);
                  }
                };
  
                // Function to end the quiz
                const endQuiz = () => {
                  const percentage = (score / (questions.length * 10)) * 100;
                  const quizContent = document.getElementById("quiz-content");
                  quizContent.innerHTML = \`
                    <div class="results">
                      <h2>Quiz Completed!</h2>
                      <p>Your Score: \${score} out of \${questions.length * 10}</p>
                      <p>Percentage: \${percentage.toFixed(2)}%</p>
                      <p>Result: \${percentage >= 50 ? '<span class="tick">✅ Pass</span>' : '<span class="cross">❌ Fail</span>'}</p>
                      <ul>
                        \${questions
                          .map(
                            (question, index) => \`
                              <li>
                                <strong>Question \${index + 1}:</strong> \${question.text}<br>
                                <strong>Correct Answer:</strong> \${question.correct_answer}
                              </li>
                            \`
                          )
                          .join("")}
                      </ul>
                    </div>
                  \`;
                  updateProgressBar();
                  document.getElementById("timer").style.display = "none"; // Hide the timer
  
                  // Send the final score to the backend
                  sendScoreToBackend("${selectedName}", score);
                };
  
                // Function to render the current question
                const renderQuestion = () => {
                  const question = questions[currentQuestionIndex];
                  if (!question) return;
  
                  const quizContent = document.getElementById("quiz-content");
                  quizContent.innerHTML = \`
                    <div class="question">
                      <h3>Question \${currentQuestionIndex + 1}: \${question.text}</h3>
                      <div class="options">
                        \${JSON.parse(question.options)
                          .map(
                            (option, index) => \`
                              <div class="option">
                                <input
                                  type="radio"
                                  id="option\${index}"
                                  name="answer"
                                  value="\${option}"
                                  onclick="handleAnswerSelect('\${option}')"
                                />
                                <label for="option\${index}">\${option}</label>
                              </div>
                            \`
                          )
                          .join("")}
                      </div>
                    </div>
                  \`;
                  updateProgressBar();
                };
  
                // Function to handle answer selection
                const handleAnswerSelect = (answer) => {
                  const question = questions[currentQuestionIndex];
                  const isCorrect = answer === question.correct_answer;
  
                  // Update score
                  if (isCorrect) {
                    score += 10;
                  }
  
                  // Show feedback (tick or cross)
                  const quizContent = document.getElementById("quiz-content");
                  quizContent.innerHTML += \`
                    <div class="feedback">
                      \${isCorrect ? '<span class="tick">✅ Correct</span>' : '<span class="cross">❌ Incorrect</span>'}
                    </div>
                  \`;
  
                  // Move to the next question after a short delay
                  setTimeout(() => {
                    currentQuestionIndex++;
                    if (currentQuestionIndex < questions.length) {
                      renderQuestion();
                    } else {
                      endQuiz();
                    }
                  }, 1000); // 1-second delay before moving to the next question
                };
  
                // Render the first question and start the timer
                renderQuestion();
                startTimer();
              </script>
            </body>
          </html>
        `);
  
        // Close the document to finish loading
        newWindow.document.close();
  
        // Close the dialog
        handleDialogClose();
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
      }
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #1D2B64, #F8CDDA)",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          backgroundColor: "#fff",
          padding: 4,
          borderRadius: 3,
          boxShadow: 4,
          animation: "fadeIn 1s ease-in-out",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          color="primary"
          gutterBottom
          sx={{
            textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
          }}
        >
          Quiz Application
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Email"
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<Login />}
            sx={{
              mt: 2,
              background: "linear-gradient(to right, #6a11cb, #2575fc)",
              "&:hover": {
                background: "linear-gradient(to right, #2575fc, #6a11cb)",
              },
            }}
          >
            Login
          </Button>
          <Typography align="center" sx={{ mt: 2 }}>
            <a
              href="#"
              onClick={handleDialogOpen}
              style={{
                textDecoration: "none",
                color: "#6a11cb",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.color = "#2575fc")}
              onMouseOut={(e) => (e.target.style.color = "#6a11cb")}
            >
              Click to Play
            </a>
          </Typography>
        </form>
      </Container>

      {/* Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            background: "linear-gradient(to right, #1D2B64, #F8CDDA)",
            borderRadius: "16px",
            padding: "16px",
            width: "400px",
            color: "#fff",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          Select Your Player
          <IconButton onClick={handleDialogClose} sx={{ color: "#fff" }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress sx={{ color: "#fff" }} />
          ) : usernames.length > 0 ? (
            <>
              <Typography sx={{ mb: 2 }}>Select Your Name:</Typography>
              <Select
                fullWidth
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
                displayEmpty
                sx={{
                  mt: 2,
                  background: "#fff",
                  borderRadius: "8px",
                  "& .MuiSelect-select": {
                    padding: "10px",
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Select a Player
                </MenuItem>
                {usernames.map((user, index) => (
                  <MenuItem key={index} value={user.username}>
                    {user.username}
                  </MenuItem>
                ))}
              </Select>
            </>
          ) : (
            <Typography>No usernames available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayCircleOutline />}
            onClick={handlePlay}
            disabled={!selectedName}
            sx={{
              background: "linear-gradient(to right, #6a11cb, #2575fc)",
              "&:hover": {
                background: "linear-gradient(to right, #2575fc, #6a11cb)",
              },
              color: "#fff",
            }}
          >
            Play
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoginForm;