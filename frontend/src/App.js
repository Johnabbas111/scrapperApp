import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../src/src/context/AuthContext";
import Login from "../src/src/pages/Login";
import { useAuth } from "../src/src/context/AuthContext";
import Home from "../src/src/pages/Home";
// import Register from "./components/Register";
// import Dashboard from "./components/Dashboard";

function AppContext() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" /> : <Login />}
      />
    </Routes>
  );
}
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContext />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
