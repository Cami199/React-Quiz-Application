import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
import AdminDashboard from "./components/admin";
import LoginForm from "./components/login"; 
import View from "./components/View";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/view" element={<View />} /> {/* New route for view */}
      </Routes>
    </Router>
  );
}

export default App;
