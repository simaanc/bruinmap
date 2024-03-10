import React, { useState, useEffect } from "react";
import { Col, Button, Form, Dropdown, FormControl } from 'react-bootstrap';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import logo from "../Assets/icon.jpg"; // Adjust the path as necessary
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faBars, faSearch, faStepBackward, faUser, faX } from '@fortawesome/free-solid-svg-icons';
//import "animate.css";
import "./Navbar.css";
import { SidebarData } from "./SidebarData.js";


const Navbar = () => {
  // States
  const { user, signIn, logout, createUser, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [theme, setTheme] = useState("dark"); // Default to dark theme
  const [inputClass, setInputClass] = useState(""); // State for input classes
  const buttonStyle = email && password // For the "Sign In" button
    ? { backgroundColor: '#0a87ca' } // Blue background when both fields are filled
    : { backGroundColor: 'grey' }; // Grey background when either field is empty
  
  // For the search bar
  const [placeholder, setPlaceholder] = useState('Search');
  const handleFocus = () => setPlaceholder('Enter room # or building...');
  const handleBlur = () => setPlaceholder('Search');

  // For the sidebar
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);

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
    <>
    <div>
      <nav class="navbar navbar-expand-lg navbar-dark">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Logo at the top left */}
          <a class="navbar-brand me-2 bruinmap-logo">
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

            <Dropdown.Menu style={{ padding: '4px', width: '200px' }}>
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
                        >Sign In
                      </Button>
                    </Col>
                  </div>
                  {/* Forgot password */}
                  <Dropdown.Item
                    onClick={handleResetPassword}
                    style={{ color: 'grey', textAlign: 'center', display: 'block' }}>
                      Forgot Password?
                  </Dropdown.Item>
                </>
              }
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* Sidebar open button */}
        <button
          data-mdb-collapse-init
          class="navbar-toggler sidebar-button"
          type="button"
          data-mdb-target="#navbarButtonsExample"
          aria-controls="navbarButtonsExample"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={showSidebar}>
          {sidebar
            ? <FontAwesomeIcon icon={faX} style={{ color: "white", padding: "4px" }} />
            : <FontAwesomeIcon icon={faBars} style={{ color: "white", padding: "4px" }} />
          }  
        </button>
        <ul className={sidebar ? "sidebar-menu active" : "sidebar-menu"}>
          {SidebarData.map((item, index) => {
            return (
              <li key={index} className={item.cName}>
                <Link to={item.path}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Events */}
        <div class="collapse navbar-collapse" id="navbarButtonsExample" >
          <ul class="navbar-nav me-auto mb-2 mb-lg-0" >
            <li class="nav-item">
              <a class="nav-link" href="#" style={{marginLeft: "20px"}}>Events</a> {/* We could put a general list of events that users can see even when logged out */}
            </li>
          </ul>

        {/* Search bar and search icon */}
        <span style={{ marginRight: "0px" }}>
          <nav class="navbar navbar-dark">
            <span class="container-fluid">
              <button
                style={{
                  backgroundColor: "#0a87ca",
                  borderColor: "#024b76",
                  borderWidth: '1.5px',
                  boxShadow: "0 0 5px #0a87ca",
                  padding: "10px", margin: "8px" }}
                class="input-group-text border-0"
                id="search-addon">
                <FontAwesomeIcon icon={faSearch} style={{ color: "white" }} />
              </button>
              <form class="d-flex input-group w-auto">
                <input
                  type="search"
                  class="form-control rounded"
                  placeholder={placeholder}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  aria-label="Search"
                  aria-describedby="search-addon"
                  style={{ backgroundColor: '#f1f2f3', width: '300px' }}
                />
              </form>

              {/* GitHub button */}
              <button
                class="input-group-text border-0"
                onClick={() => { window.location.href = "https://github.com/simaanc/bruinmap"; }}
                style={{ backgroundColor: "black", color: "white", borderWidth: '1.5px', padding: "12px", margin: "8px" }}>
                <FontAwesomeIcon icon={faGithub} />
              </button>
            </span>
          </nav>
        </span>
        </div>
      </nav>
    </div>
    
    </>
  );
}
export default Navbar;