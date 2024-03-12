import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import { useAuth } from "../../Context/AuthContext";
import "animate.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [formClass, setFormClass] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuth();

  useEffect(() => {
    if (error) {
      setFormClass("animate__animated animate__shakeX");
      setTimeout(() => setFormClass(""), 1000); // Remove the class after 1 second
    }
  }, [error]);

  const handleSignIn = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(""); // Reset any existing errors
    try {
      await signIn(email, password);
      navigate("/"); // Navigate on successful login
    } catch (e) {
      setError(e.message); // Set error state to display message
    }
  };

  return (
    <div className="sign-in-container">
      <Container>
        <Form onSubmit={handleSignIn} className={formClass}>
          <Row>
            <Col>
              <Form.Label>User Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Col>
            <Col>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Col>
            <Col xs="auto">
              <Button type="submit" size="medium">
                Login
              </Button>
            </Col>
          </Row>
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        </Form>
      </Container>
    </div>
  );
};

export default SignIn;
