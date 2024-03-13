import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";
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
import EventsSidebar from "./EventsSidebar.js"


const Navbar = () => {
	// States
	const { user, isLoggedIn, signIn, logout, createUser, resetPassword } =
		useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [inputClass, setInputClass] = useState(""); // State for input classes

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
	const [eventsSidebarFromSidebar, setEventsSidebarFromSidebar] = useState(false);

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
				<nav className="navbar navbar-expand-md navbar-dark " >
					<div style={{ display: "flex", alignItems: "center", gap: "20px", zIndex: "10000"}}>
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

					{/* Sidebar */}
					{!eventsSidebar && (
						<button
							className="sidebar-button"
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
					/>
					{/* Events */}
					{!sidebar && !eventsSidebarFromSidebar && ( //BUG: HAMBURGER MENU DOES NOT DISAPPEAR AFTER CLICKING AN EVENT
						<div class="collapse navbar-collapse" id="navbarButtonsExample" >
							<ul class="navbar-nav me-auto mb-2 mb-lg-0">
								<li class="nav-item">


								</li>
							</ul>

							{/* Search bar and search icon */}
							<span style={{ marginRight: "0px"}} >
								<nav class="navbar navbar-dark" >
									<span class="container-fluid" >
										<SearchBar  />
										{/* Not using EventsButton.js, just using it inline w/ Srishti's method */}
										<button 
											class="input-group-text border-0"
											//href="#"
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
											onClick={showEventsSidebar}
										>
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
