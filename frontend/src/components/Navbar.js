import React, { useState, useEffect } from "react";
import { Navbar, Container, Row, Col, Button, Form, Dropdown, FormControl } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../Assets/icon.jpg"; // Adjust the path as necessary
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStepBackward, faUser } from '@fortawesome/free-solid-svg-icons';
//import "animate.css";
import "../App.css";

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

  const buttonStyle = email && password
    ? { backgroundColor: '#0a87ca' } // Blue background when both fields are filled
    : { backGroundColor: 'grey' }; // Grey background when either field is empty
  const [placeholder, setPlaceholder] = useState('Search');
  const handleFocus = () => setPlaceholder('Enter room # or building...');
  const handleBlur = () => setPlaceholder('Search');
  return (
    <div>

      <nav class="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#1c1e21' }} >

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a class="navbar-brand me-2" style={{ marginLeft: "16px", boxShadow: "0 0 5px #0a87ca", borderRadius: "10px", backgroundColor: "#232629" }}>
            <img
              src="https://i.imgur.com/pSTs7Pe.png"
              height="64"
              alt="BruinMap Logo"
              loading="lazy"
            />
          </a>
          {/* Simple Dropdown Menu */}
          <Dropdown>
            <Dropdown.Toggle
              variant="primary"
              style={{ backgroundColor: "#0a87ca", borderColor: "#024b76", borderWidth: '1.5px', boxShadow: "0 0 5px #0a87ca" }}
              id="dropdown-basic"
            >
              {user
                ? <FontAwesomeIcon icon={faUser} /> /* Display user icon if logged in */
                : "Sign In" /* Display "Signed In" if not signed in */
              }
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ padding: '4px', minWidth: '200px' }}>
              {user
                ? <>
                  {/* Menu items for when user is signed in */}
                  <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                  <Dropdown.Item onClick={handleSignOut}>Logout</Dropdown.Item>
                </>
                : <>
                  {/* Menu items for when user is not signed in */}
                  <div>
                    <Form inline="true" className="ml-auto" onSubmit={handleSubmit}>
                      {/* Email input field */}
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
                      {/* Password input field */}
                      <Col xs="auto">
                        <FormControl
                          type="password"
                          placeholder="Password"
                          className={`mr-sm-2 ${inputClass}`} // And here
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="current-password"
                          style={{ marginTop: '8px' }}
                        />
                      </Col>
                    </Form>
                    {/* Sign in button */}
                    <Col xs="auto">
                      <Button
                        className="d-flex justify-content-center sign-in-button"
                        type="button"
                        onClick={handleSubmit}
                        style={{ ...buttonStyle }}
                        disabled={!email || !password} // Disables the button if either field is empty
                      >
                        Sign In
                      </Button>
                    </Col>
                  </div>
                  {/* Forgot password */}
                  <Dropdown.Item onClick={handleResetPassword} style={{ color: 'grey', textAlign: 'center', display: 'block' }}>Forgot Password?</Dropdown.Item>
                </>
              }
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div class="container">

          <button
            data-mdb-collapse-init
            class="navbar-toggler"
            type="button"
            data-mdb-target="#navbarButtonsExample"
            aria-controls="navbarButtonsExample"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i class="fas fa-bars"></i>
          </button>


          <div class="collapse navbar-collapse" id="navbarButtonsExample">

            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link" href="#" >Events</a> {/* We could put a general list of events that users can see even when logged out */}
              </li>
            </ul>


            <nav class="navbar navbar-dark">
              <div class="container-fluid">
              <span style={{backgroundColor: "black", margin: "8px"}} class="input-group-text border-0" id="search-addon">
                  <i class="fas fa-search" aria-hidden="true"></i>
                </span>
                <form class ="d-flex input-group w-auto">
                  <input 
                    type="search"
                    class="form-control rounded"
                    placeholder={placeholder}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    aria-label="Search"
                    aria-describedby="search-addon"
                    style={{backgroundColor: '#f1f2f3', width: '300px' }}
                  />

                </form>
              </div>
            </nav>



            <a
              data-mdb-ripple-init
              class="btn px-3"
              href="https://github.com/simaanc/bruinmap"
              role="button"
              style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: "black" }} // Adjust padding and font size as needed
            >
              <i class="fab fa-github"></i>
            </a>


          </div>

        </div>

      </nav>

    </div>
  );
}
{/* return (
  <Navbar
    bg={theme}
    expand="lg"
    variant={theme}
    className="py-2" // Adjust padding here 
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
*/}
export default UnifiedNavbar;