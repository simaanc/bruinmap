import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import BruinMapIcon from "../Assets/bruinmaplogo.svg";
import "./Navbar.css";
import SearchBar from "./SearchBar.js";
import GitHubButton from "./GitHubButton.js";
import Sidebar from "./Sidebar.js";
import DropdownMenu from "./DropdownMenu.js";
import { useThemeDetector } from "./utils.js";
import EventsSidebar from "./EventsSidebar.js";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Navbar = () => {
  // States
  const { user, isLoggedIn, signIn, logout, createUser, resetPassword } =
    useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const buttonStyle =
    email && password // For the "Sign In" button
      ? { backgroundColor: "#0a87ca" } // Blue background when both fields are filled
      : { backGroundColor: "grey" }; // Grey background when either field is empty

  const theme = useThemeDetector();

  // For the sidebar
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => {
    setSidebar(!sidebar);
  };
  // For the event sidebar
  const [eventsSidebar, setEventsSidebar] = useState(false);
  const showEventsSidebar = () => {
    setEventsSidebar(!eventsSidebar);
  };
  const [eventsSidebarFromSidebar, setEventsSidebarFromSidebar] =
    useState(false);

  //For login errors
  const [loginError, setLoginError] = useState(false);

  const handleLogin = async () => {
    try {
      await signIn(email, password); // Attempt to sign in
      localStorage.setItem("userEmail", email); // Persist user's email on successful login
      setLoginError(false); // Reset loginError on successful login
      navigate("/"); // Navigate to home page on success
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(true); // Set loginError to true on failure
    }
  };

  // Function to handle signup
  const handleSignUp = async () => {
    try {
      await createUser(email, password);
      localStorage.setItem("userEmail", email); // Persist user's email on successful login
      setLoginError(false); // Reset loginError on successful login
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup error: " + error);
      setLoginError(true); // Set loginError to true on failure
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

  const [userEvents, setUserEvents] = useState([]);

  const fetchUserEvents = async () => {
    try {
      if (!user) {
        console.error("User is not logged in.");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/auth/events`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const events = response.data.events;

      setUserEvents(events);
    } catch (error) {
      console.error("Error fetching user events:", error);
    }
  };

  return (
    <>
      <div>
        <nav className="navbar navbar-expand-md navbar-dark ">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              zIndex: "10000",
            }}>
            {/* Logo at the top left */}
            <Link to="/" className="navbar-brand me-2 bruinmap-logo">
              <img
                src={BruinMapIcon}
                height="64"
                alt="BruinMap Logo"
                loading="lazy"
              />
            </Link>

            {/* Simple Dropdown Menu */}
            <DropdownMenu
              user={user}
              handleSignOut={handleSignOut}
              handleResetPassword={handleResetPassword}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              buttonStyle={buttonStyle}
              isDarkTheme={theme}
              handleLogin={handleLogin}
              handleSignUp={handleSignUp}
              loginError={loginError}
            />
          </div>

          {/* Sidebar */}
          {!eventsSidebar && (
            <button
              className="sidebar-button"
              type="button"
              data-mdb-target="#navbarButtonsExample"
              aria-controls="navbarButtonsExample"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={showSidebar}>
              {sidebar ? (
                <FontAwesomeIcon
                  icon={faX}
                  style={{ color: "white", padding: "4px" }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faBars}
                  style={{ color: "white", padding: "4px" }}
                />
              )}
            </button>
          )}
          <Sidebar
            sidebar={sidebar}
            showSidebar={showSidebar}
            isLoggedIn={isLoggedIn}
            showEventsSidebar={showEventsSidebar}
            style={{ height: "100%" }}
            eventsSidebarFromSidebar={eventsSidebarFromSidebar}
            setEventsSidebarFromSidebar={setEventsSidebarFromSidebar}
          />
          <EventsSidebar
            eventsSidebar={eventsSidebar}
            showEventsSidebar={showEventsSidebar}
            isLoggedIn={isLoggedIn}
            style={{ height: "100%" }}
            showSidebar={showSidebar}
            eventsSidebarFromSidebar={eventsSidebarFromSidebar}
            setEventsSidebarFromSidebar={setEventsSidebarFromSidebar}
            savedEvents={userEvents}
            fetchUserEvents={fetchUserEvents}
          />
          {/* Events */}
          {!sidebar && (
            <div className="collapse navbar-collapse" id="navbarButtonsExample">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item"></li>
              </ul>

              {/* Search bar and search icon */}
              <span style={{ marginRight: "0px" }}>
                <nav className="navbar navbar-dark">
                  <span className="container-fluid">
                    <SearchBar />
                    {/* Not using EventsButton.js, just using it inline w/ Srishti's method */}
                    <button
                      className="input-group-text border-0"
                      style={{
                        backgroundColor: "#0a87ca",
                        borderColor: "#024b76",
                        borderWidth: "1.5px",
                        boxShadow: "0 0 5px #0a87ca",
                        padding: "8px",
                        margin: "8px",
                        color: "white",
                        borderRadius: "8px",
                      }}
                      onClick={showEventsSidebar}>
                      Events
                    </button>

                    <GitHubButton />
                  </span>
                </nav>
              </span>
            </div>
          )}
        </nav>
      </div>
    </>
  );
};
export default Navbar;
