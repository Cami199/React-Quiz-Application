import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Box,
  Divider,
  Modal,
  TextField,
  IconButton,
  InputAdornment,
  Avatar,
  Tooltip,
  Container,
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Quiz,
  Logout,
  Dashboard,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import View from "./View";

// Custom Material-UI theme
const theme = createTheme({
  typography: {
    fontFamily: "'Poppins', sans-serif",
    allVariants: {
      color: "#333",
    },
  },
  palette: {
    primary: {
      main: "#6a11cb",
    },
    secondary: {
      main: "#2575fc",
    },
    error: {
      main: "#f44336",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "20px",
          fontWeight: "bold",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
        },
      },
    },
  },
});

const AdminDashboard = () => {
  const [open, setOpen] = useState(false); // Sidebar state
  const [modalOpen, setModalOpen] = useState(false); // Modal state
  const [modalType, setModalType] = useState(""); // To differentiate modals
  const [passwordVisible, setPasswordVisible] = useState(false); // Toggle password visibility
  const [username, setUsername] = useState(""); // Username state
  const [email, setEmail] = useState(""); // Email state
  const [password, setPassword] = useState(""); // Password state
  const [quizTitle, setQuizTitle] = useState(""); // Quiz title state
  const [quizDescription, setQuizDescription] = useState(""); // Quiz description state
  const [questions, setQuestions] = useState([]); // List of questions
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    type: "multiple-choice",
    options: ["", "", "", ""],
    correctAnswer: "",
  });
  const [passingCriteria, setPassingCriteria] = useState(60); // Passing criteria state
  const [error, setError] = useState(""); // Error message state
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  const navigate = useNavigate(); // Initialize useNavigate

  // Function to toggle the sidebar
  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Function to open the modal and set type (addUser or createQuiz)
  const handleOpenModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType("");
    setUsername("");
    setEmail("");
    setPassword("");
    setQuizTitle("");
    setQuizDescription("");
    setQuestions([]);
    setCurrentQuestion({
      text: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: "",
    });
    setPassingCriteria(60);
    setError("");
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (modalType === "addUser") {
      // Password validation
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
      if (!passwordRegex.test(password)) {
        setError(
          "Password must contain at least one capital letter, one number, one symbol, and be at least 6 characters long."
        );
        setSnackbarOpen(true);
        return;
      }

      // Send data to Node.js backend
      try {
        const response = await fetch("http://localhost:5000/api/add_user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          setSuccessMessage(result.message);
          setSnackbarOpen(true);
          handleCloseModal();
        } else {
          setError(result.message || "Unable to create user.");
          setSnackbarOpen(true);
        }
      } catch (err) {
        setError("An error occurred while connecting to the server.");
        setSnackbarOpen(true);
        console.error(err); // Log the error for debugging
      }
    } else if (modalType === "createQuiz") {
      // Handle Create Quiz form submission
      const quizData = {
        title: quizTitle,
        description: quizDescription,
        questions,
        passingCriteria,
      };

      try {
        const response = await fetch("http://localhost:5000/api/create_quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(quizData),
        });

        const result = await response.json();

        if (response.ok) {
          setSuccessMessage(result.message);
          setSnackbarOpen(true);
          handleCloseModal();
        } else {
          setError(result.message || "Unable to create quiz.");
          setSnackbarOpen(true);
        }
      } catch (err) {
        setError("An error occurred while connecting to the server.");
        setSnackbarOpen(true);
        console.error(err);
      }
    }
  };

  // Function to close the snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        {/* Top App Bar */}
        <AppBar
          position="fixed"
          sx={{
            background: "linear-gradient(to right, #6a11cb, #2575fc)",
          }}
        >
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
              
            </Typography>
            <Tooltip title="Profile Settings">
              <IconButton color="inherit">
                <Avatar sx={{ bgcolor: "#f44336" }}>AD</Avatar>
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        {/* Sidebar Drawer */}
        <Drawer anchor="left" open={open} onClose={toggleDrawer}>
          <List sx={{ width: 280, bgcolor: "#f3f4f6", height: "100vh" }}>
            <Typography
              variant="h5"
              sx={{
                textAlign: "center",
                my: 2,
                fontWeight: "bold",
                color: "#6a11cb",
              }}
            >
              Admin Menu
            </Typography>
            <Divider />
            <ListItem button>
              <ListItemIcon>
                <Dashboard sx={{ color: "#6a11cb" }} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => handleOpenModal("addUser")}>
              <ListItemIcon>
                <PersonIcon sx={{ color: "#2575fc" }} />
              </ListItemIcon>
              <ListItemText primary="Add User" />
            </ListItem>
            <ListItem button onClick={() => handleOpenModal("createQuiz")}>
              <ListItemIcon>
                <Quiz sx={{ color: "#2575fc" }} />
              </ListItemIcon>
              <ListItemText primary="Create Quiz" />
            </ListItem>
            
            <ListItem button onClick={() => navigate("/view")}>
              <ListItemIcon>
                <SettingsIcon sx={{ color: "#9c27b0" }} />
              </ListItemIcon>
              <ListItemText primary="Settings"  />
            </ListItem>
          </List>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 4,
            mt: 8,
            backgroundColor: "#f7f9fc",
            minHeight: "100vh",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#6a11cb",
              mb: 2,
              textAlign: "center",
              fontSize: "1.2rem",
            }}
          >
            Welcome to the Admin Dashboard
          </Typography>

          <Container maxWidth="md">
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mt: 3,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenModal("addUser")}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                Add User <PersonIcon />
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Quiz />}
                onClick={() => handleOpenModal("createQuiz")}
              >
                Create Quiz
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Modal for Forms */}
<Modal open={modalOpen} onClose={handleCloseModal}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 500, // Adjusted width
      bgcolor: "white",
      boxShadow: 24,
      p: 3, // Reduced padding
      borderRadius: "15px",
      maxHeight: "80vh", // Set maximum height to 80% of the viewport height
      overflowY: "auto", // Enable vertical scrolling
    }}
  >
    <form onSubmit={handleSubmit}>
      <Typography
        variant="h5"
        sx={{ mb: 2, color: "#6a11cb", fontWeight: "bold", textAlign: "center" }}
      >
        {modalType === "addUser" ? "Add New User" : "Create New Quiz"}
      </Typography>

      {modalType === "addUser" ? (
        // Add User Form
        <>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            size="small"
            sx={{ mb: 1.5, fontSize: "0.875rem" }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            size="small"
            sx={{ mb: 1.5, fontSize: "0.875rem" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type={passwordVisible ? "text" : "password"}
            variant="outlined"
            fullWidth
            size="small"
            sx={{ mb: 1.5, fontSize: "0.875rem" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    size="small"
                  >
                    {passwordVisible ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </>
      ) : (
        // Create Quiz Form
        <>
          <TextField
            label="Quiz Title"
            variant="outlined"
            fullWidth
            size="small"
            sx={{ mb: 1.5, fontSize: "0.875rem" }}
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
          
          />
          <TextField
            label="Quiz Description"
            variant="outlined"
            fullWidth
            size="small"
            sx={{ mb: 1.5, fontSize: "0.875rem" }}
            value={quizDescription}
            onChange={(e) => setQuizDescription(e.target.value)}
            
          />

          {/* Add Question Section */}
          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontSize: "1rem" }}>
            Add Questions
          </Typography>

          <TextField
            label="Question Text"
            variant="outlined"
            fullWidth
            size="small"
            sx={{ mb: 1.5, fontSize: "0.875rem" }}
            value={currentQuestion.text}
            onChange={(e) =>
              setCurrentQuestion({ ...currentQuestion, text: e.target.value })
            }
            
          />

          <TextField
            select
            label="Question Type"
            variant="outlined"
            fullWidth
            size="small"
            sx={{ mb: 1.5, fontSize: "0.875rem" }}
            value={currentQuestion.type}
            onChange={(e) =>
              setCurrentQuestion({ ...currentQuestion, type: e.target.value })
            }
            
          >
            <MenuItem value="multiple-choice" sx={{ fontSize: "0.875rem" }}>Multiple Choice</MenuItem>
            <MenuItem value="true-false" sx={{ fontSize: "0.875rem" }}>True/False</MenuItem>
          </TextField>

          {currentQuestion.type === "multiple-choice" && (
            <>
              {[0, 1, 2, 3].map((index) => (
                <TextField
                  key={index}
                  label={`Option ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={{ mb: 1.5, fontSize: "0.875rem" }}
                  value={currentQuestion.options[index]}
                  onChange={(e) => {
                    const newOptions = [...currentQuestion.options];
                    newOptions[index] = e.target.value;
                    setCurrentQuestion({ ...currentQuestion, options: newOptions });
                  }}
                  
                />
              ))}
            </>
          )}

          <TextField
            label="Correct Answer"
            variant="outlined"
            fullWidth
            size="small"
            sx={{ mb: 1.5, fontSize: "0.875rem" }}
            value={currentQuestion.correctAnswer}
            onChange={(e) =>
              setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })
            }
            
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="small"
            sx={{ mt: 1, mb: 1.5, fontSize: "0.875rem" }}
            onClick={() => {
              setQuestions([...questions, currentQuestion]);
              setCurrentQuestion({
                text: "",
                type: "multiple-choice",
                options: ["", "", "", ""],
                correctAnswer: "",
              });
            }}
          >
            Add Question
          </Button>

          {/* Display Added Questions */}
          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontSize: "1rem" }}>
            Added Questions
          </Typography>
          {questions.map((question, index) => (
            <Box key={index} sx={{ mb: 1.5 }}>
              <Typography variant="body1" sx={{ fontSize: "0.875rem" }}>
                <strong>Question {index + 1}:</strong> {question.text}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                <strong>Type:</strong> {question.type}
              </Typography>
              {question.type === "multiple-choice" && (
                <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                  <strong>Options:</strong> {question.options.join(", ")}
                </Typography>
              )}
              <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                <strong>Correct Answer:</strong> {question.correctAnswer}
              </Typography>
            </Box>
          ))}

          {/* Passing Criteria */}
          <TextField
            label="Passing Criteria (%)"
            variant="outlined"
            fullWidth
            size="small"
            sx={{ mt: 1.5, mb: 1.5, fontSize: "0.875rem" }}
            type="number"
            value={passingCriteria}
            onChange={(e) => setPassingCriteria(e.target.value)}
            
          />
        </>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        size="small"
        sx={{ mt: 1.5, fontSize: "0.875rem" }}
      >
        {modalType === "addUser" ? "Add User" : "Create Quiz"}
      </Button>
    </form>
  </Box>
 </Modal>

        {/* Snackbar for messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={error ? "error" : "success"}
            sx={{ width: "100%" }}
          >
            {error || successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;