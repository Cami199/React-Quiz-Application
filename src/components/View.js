import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Button,
  Modal,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const View = () => {
  const [quizzes, setQuizzes] = useState([]); // List of quizzes
  const [scores, setScores] = useState([]); // List of scores
  const [view, setView] = useState("quizzes"); // To toggle between quizzes and scores
  const [modalOpen, setModalOpen] = useState(false); // Modal state
  const [currentQuiz, setCurrentQuiz] = useState(null); // Current quiz being edited
  const [error, setError] = useState(""); // Error message state
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state

  // Fetch quizzes and scores from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizzesResponse = await axios.get("http://localhost:5000/api/quizzes");
        setQuizzes(quizzesResponse.data);

        const scoresResponse = await axios.get("http://localhost:5000/api/scores");
        setScores(scoresResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Function to delete a quiz
  const handleDeleteQuiz = async (quizId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/quizzes/${quizId}`);
      if (response.status === 200) {
        setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
        setSuccessMessage("Quiz deleted successfully!");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setError("Failed to delete quiz.");
      setSnackbarOpen(true);
      console.error("Error deleting quiz:", error);
    }
  };

  // Function to open the edit modal
  const handleEditQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setModalOpen(true);
  };

  // Function to handle form submission for editing a quiz
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/quizzes/${currentQuiz.id}`,
        currentQuiz
      );
      if (response.status === 200) {
        setQuizzes(
          quizzes.map((quiz) =>
            quiz.id === currentQuiz.id ? currentQuiz : quiz
          )
        );
        setSuccessMessage("Quiz updated successfully!");
        setSnackbarOpen(true);
        setModalOpen(false);
      }
    } catch (error) {
      setError("Failed to update quiz.");
      setSnackbarOpen(true);
      console.error("Error updating quiz:", error);
    }
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentQuiz(null);
  };

  // Function to close the snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#6a11cb" }}>
        {view === "quizzes" ? "View Quizzes" : "View Scores"}
      </Typography>

      {/* Toggle between Quizzes and Scores */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
          onClick={() => setView("quizzes")}
        >
          View Quizzes
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setView("scores")}
        >
          View Scores
        </Button>
      </Box>

      {/* Display Quizzes or Scores */}
      {view === "quizzes" ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell>{quiz.id}</TableCell>
                  <TableCell>{quiz.title}</TableCell>
                  <TableCell>{quiz.description}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditQuiz(quiz)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteQuiz(quiz.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scores.map((score) => (
                <TableRow key={score.id}>
                  <TableCell>{score.username}</TableCell>
                  <TableCell>{score.score}</TableCell>
                  <TableCell>
                    {new Date(score.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Quiz Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "white",
            boxShadow: 24,
            p: 3,
            borderRadius: "15px",
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#6a11cb" }}>
            Edit Quiz
          </Typography>
          {currentQuiz && (
            <form onSubmit={handleEditSubmit}>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={currentQuiz.title}
                onChange={(e) =>
                  setCurrentQuiz({ ...currentQuiz, title: e.target.value })
                }
                required
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={currentQuiz.description}
                onChange={(e) =>
                  setCurrentQuiz({ ...currentQuiz, description: e.target.value })
                }
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Save Changes
              </Button>
            </form>
          )}
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
  );
};

export default View;