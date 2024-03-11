import React, { useState, useEffect } from "react";
import { Col, Button, Form, Dropdown, FormControl } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import BruinMapIcon from "../Assets/bruinmaplogo.svg";
//import "animate.css";
import "./Navbar.css";
import SearchBar from "./SearchBar";
import GitHubButton from "./GitHubButton";
import Sidebar from "./Sidebar.js";
import DropdownMenu from "./DropdownMenu.js";
import { useThemeDetector } from "./utils";

const Navbar = () => {
	// States
	const { user, isLoggedIn, signIn, logout, createUser, resetPassword } =
		useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSigningUp, setIsSigningUp] = useState(false);
	const [inputClass, setInputClass] = useState(""); // State for input classes
	const buttonStyle =
		email && password // For the "Sign In" button
			? { backgroundColor: "#0a87ca" } // Blue background when both fields are filled
			: { backGroundColor: "grey" }; // Grey background when either field is empty

	// For the search bar
	const [placeholder, setPlaceholder] = useState("Search");

	const handleFocus = () => setPlaceholder("Enter room # or building...");
	const handleBlur = () => setPlaceholder("Search");
	const theme = useThemeDetector();

	// For the sidebar
	const [sidebar, setSidebar] = useState(false);
	const showSidebar = () => {
		setSidebar(!sidebar);
	};

	const triggerShakeAnimation = () => {
		setInputClass("animate__animated animate__shakeX");
		setTimeout(() => setInputClass(""), 500); // Remove the class after 1 second
	};

	const handleLogin = async () => {
		try {
			await signIn(email, password);
			navigate("/");
		} catch (error) {
			console.error("Login error:", error);
			triggerShakeAnimation(); // If you have an animation for errors
		}
	};

	// Function to handle signup
	const handleSignUp = async () => {
		try {
			await createUser(email, password);
			navigate("/");
		} catch (error) {
			console.error("Signup error:", error);
			triggerShakeAnimation(); // If you have an animation for errors
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
				<nav className="navbar navbar-expand-lg navbar-dark">
					<div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
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
							inputClass={inputClass}
							buttonStyle={buttonStyle}
							isDarkTheme={theme}
							handleLogin={handleLogin}
							handleSignUp={handleSignUp}
						/>
					</div>

					{/* Sidebar open button */}
					<button
						class="sidebar-button"
						type="button"
						data-mdb-target="#navbarButtonsExample"
						aria-controls="navbarButtonsExample"
						aria-expanded="false"
						aria-label="Toggle navigation"
						onClick={showSidebar}
					>
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
					<Sidebar
						sidebar={sidebar}
						showSidebar={showSidebar}
						isLoggedIn={isLoggedIn}
						style={{ backgroundColor: "red" }}
					/>

					{/* Events */}
					{!sidebar && (
						<div class="collapse navbar-collapse" id="navbarButtonsExample">
							<ul class="navbar-nav me-auto mb-2 mb-lg-0">
								<li class="nav-item">
									<a class="nav-link" href="#" style={{ marginLeft: "20px" }}>
										Events
									</a>{" "}
									{/* We could put a general list of events that users can see even when logged out */}
								</li>
							</ul>

							{/* Search bar and search icon */}
							<span style={{ marginRight: "0px" }}>
								<nav class="navbar navbar-dark">
									<span class="container-fluid">
										<SearchBar />
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
