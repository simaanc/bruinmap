import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import { AuthContextProvider } from "./Context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ResetPassword from "./components/ResetPassword"; // Add this import

function App() {
  return (
    <div>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reset/:token" element={<ResetPassword />} />
        </Routes>
      </AuthContextProvider>
    </div>
  );
}

export default App;