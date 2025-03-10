const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

// Create an Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request bodies

// MySQL database connection
const db = mysql.createConnection({
  host: "localhost", // MySQL server host
  user: "root", // MySQL username
  password: "", // MySQL password
  database: "quiz_db", // MySQL database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

// API endpoint to fetch usernames
app.get("/api/users", (req, res) => {
  const sql = "SELECT username FROM users";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ message: "Failed to fetch users." });
    }
    res.status(200).json(results);
  });
});

app.get("/api/quizzes", (req, res) => {
  const sql = "SELECT * FROM quizzes";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching quizzes:", err);
      return res.status(500).json({ message: "Failed to fetch quizzes." });
    }
    res.status(200).json(results);
  });
});

app.get("/api/scores", (req, res) => {
  const sql = "SELECT * FROM scores";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching scores:", err);
      return res.status(500).json({ message: "Failed to fetch scores." });
    }
    res.status(200).json(results);
  });
});

app.delete("/api/quizzes/:id", (req, res) => {
  const quizId = req.params.id;
  const sql = "DELETE FROM quizzes WHERE id = ?";
  db.query(sql, [quizId], (err, result) => {
    if (err) {
      console.error("Error deleting quiz:", err);
      return res.status(500).json({ message: "Failed to delete quiz." });
    }
    res.status(200).json({ message: "Quiz deleted successfully!" });
  });
});

app.put("/api/quizzes/:id", (req, res) => {
  const quizId = req.params.id;
  const { title, description } = req.body;
  const sql = "UPDATE quizzes SET title = ?, description = ? WHERE id = ?";
  db.query(sql, [title, description, quizId], (err, result) => {
    if (err) {
      console.error("Error updating quiz:", err);
      return res.status(500).json({ message: "Failed to update quiz." });
    }
    res.status(200).json({ message: "Quiz updated successfully!" });
  });
});


// API endpoint to fetch all questions
app.get("/api/questions", (req, res) => {
  const sql = "SELECT * FROM questions";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching questions:", err);
      return res.status(500).json({ message: "Failed to fetch questions." });
    }
    res.status(200).json(results);
  });
});

// API endpoint to save the final score
app.post("/api/save-score", (req, res) => {
  const { username, score } = req.body;

  // Validate input
  if (!username || score === undefined) {
    return res.status(400).json({ message: "Username and score are required." });
  }

  // Insert data into the database
  const sql = "INSERT INTO scores (username, score) VALUES (?, ?)";
  db.query(sql, [username, score], (err, result) => {
    if (err) {
      console.error("Error saving score to MySQL:", err);
      return res.status(500).json({ message: "Failed to save score." });
    }
    res.status(201).json({ message: "Score saved successfully!" });
  });
});

// API endpoint to add a new user
app.post("/api/add_user", (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Hash the password (you can use a library like bcrypt for secure hashing)
  // For now, we'll use the plain password (not recommended for production)
  const hashedPassword = password;

  // Insert data into the database
  const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  db.query(sql, [username, email, hashedPassword], (err, result) => {
    if (err) {
      console.error("Error inserting data into MySQL:", err);
      return res.status(500).json({ message: "Unable to create user." });
    }
    res.status(201).json({ message: "User created successfully!" });
  });
});

// API endpoint to create a new quiz
app.post("/api/create_quiz", (req, res) => {
  const { title, description, questions, passingCriteria } = req.body;

  // Validate input
  if (!title || !description || !questions || !passingCriteria) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Insert quiz into the database
  const sql = "INSERT INTO quizzes (title, description, passing_criteria) VALUES (?, ?, ?)";
  db.query(sql, [title, description, passingCriteria], (err, result) => {
    if (err) {
      console.error("Error inserting quiz into MySQL:", err);
      return res.status(500).json({ message: "Unable to create quiz." });
    }

    const quizId = result.insertId; // Get the ID of the newly inserted quiz

    // Insert questions into the database
    const questionSql = "INSERT INTO questions (quiz_id, text, type, options, correct_answer) VALUES ?";
    const questionValues = questions.map((question) => [
      quizId,
      question.text,
      question.type,
      JSON.stringify(question.options), // Store options as JSON
      question.correctAnswer,
    ]);

    db.query(questionSql, [questionValues], (err, result) => {
      if (err) {
        console.error("Error inserting questions into MySQL:", err);
        return res.status(500).json({ message: "Unable to create quiz questions." });
      }

      res.status(201).json({ message: "Quiz created successfully!" });
    });
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});