import React, { useState, useEffect } from "react";
import {
  Navbar,
  Container,
  Nav,
  Button,
  Form,
  FormControl,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../Assets/icon.jpg"; // Adjust the path as necessary
import "animate.css";

const UnifiedNavbar = () => {
  const { user, signIn, logout, createUser, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [theme, setTheme] = useState("dark"); // Default to dark theme
  const [inputClass, setInputClass] = useState(""); // State for input classes

  const triggerShakeAnimation = () => {
    setInputClass("animate__animated animate__shakeX");
    setTimeout(() => setInputClass(""), 500); // Remove the class after 1 second
  };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mq.matches ? "dark" : "light");
    const handleChange = (e) => setTheme(e.matches ? "dark" : "light");
    mq.addListener(handleChange);
    return () => mq.removeListener(handleChange);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      triggerShakeAnimation();
      return;
    }
  
    // Attempt to sign in or sign up
    try {
      if (isSigningUp) {
        await createUser(email, password);
      } else {
        await signIn(email, password);
      }
      navigate("/");
    } catch (error) {
      console.error("Sign in error:", error); // Log the error for inspection
      if (error.code === "auth/user-not-found") {
        console.error("Sign in error: User not found", error);
      } else if (error.code === "auth/invalid-credential") {
        console.error("Sign in error: Invalid credentials", error);
      } else {
        console.error(isSigningUp ? "Sign up error:" : "Sign in error:", error);
      }
      triggerShakeAnimation(); // Trigger shake animation on error as well
    }
  };
  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/Home");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }
    try {
      await resetPassword(email);
      alert("Please check your email to reset your password.");
    } catch (error) {
      console.error("Password reset error:", error);
    }
  };

  return (
    <Navbar
      bg={theme}
      expand="lg"
      variant={theme}
      className="py-2" /* Adjust padding here */
    >
      <Container fluid>
        <Navbar.Brand onClick={() => navigate("/")}>
          <img
            src={logo}
            alt="Logo"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
          My App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
            {user && (
              <Nav.Link onClick={() => navigate("/events")}>Events</Nav.Link>
            )}
          </Nav>
          <Form inline="true" className="ml-auto" onSubmit={handleSubmit}>
            {!user ? (
              <Row className="align-items-center">
                <Col xs="auto">
                  <FormControl
                    type="email"
                    placeholder="Email"
                    className={`mr-sm-2 ${inputClass}`} // Apply the inputClass here
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </Col>
                <Col xs="auto">
                  <FormControl
                    type="password"
                    placeholder="Password"
                    className={`mr-sm-2 ${inputClass}`} // And here
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    type="submit"
                    variant={
                      isSigningUp ? "outline-primary" : "outline-success"
                    }>
                    {isSigningUp ? "Sign Up" : "Sign In"}
                  </Button>
                </Col>
                <Col xs="auto">
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={handleResetPassword}
                    className="ms-2">
                    Forgot Password?
                  </Button>
                </Col>
              </Row>
            ) : (
              <Button variant="outline-danger" onClick={handleSignOut}>
                Sign Out
              </Button>
            )}
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default UnifiedNavbar;
