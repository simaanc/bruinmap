import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home"; // Use the new UnifiedHome component
import { AuthContextProvider } from "./Context/AuthContext"; // Adjust the import path as necessary
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <div>
      <AuthContextProvider>
        <Home />
      </AuthContextProvider>
    </div>
  );
}

export default App;
