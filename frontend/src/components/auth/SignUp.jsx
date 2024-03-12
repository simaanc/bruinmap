import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { createUser } = useAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createUser(email, password);
      navigate("/"); // Navigate to the home page after successful sign up
    } catch (error) {
      setError(error.message); // Set the error message
      console.error("Sign up error:", error.message);
    }
  };

  return (
    <div className="sign-up-container">
      <form onSubmit={handleSignUp}>
        <h1>Create Account</h1>
        {error && <p className="error-message">{error}</p>}{" "}
        {/* Display error message if present */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
