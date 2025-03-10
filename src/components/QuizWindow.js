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
    if (!selectedName) {
      alert("Please select a player!");
      return;
    }

    // Fetch quiz questions from the backend
    try {
      const response = await axios.get("http://localhost:5000/api/get_quiz");
      const quizQuestions = response.data;

      // Open a new window
      const quizWindow = window.open("", "QuizWindow", "width=800,height=600");

      // Render the QuizWindow component in the new window
      quizWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Quiz Game</title>
            <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
            <style>
              body { margin: 0; font-family: 'Poppins', sans-serif; }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script src="/path/to/your/react-app.js"></script>
          </body>
        </html>
      `);

      // Render the QuizWindow component
      quizWindow.document.close();
      quizWindow.document.getElementById("root").innerHTML = `
        <QuizWindow quizQuestions='${JSON.stringify(quizQuestions)}' />
      `;
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
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

      {/* Player Selection Dialog */}
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