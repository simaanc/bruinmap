import React, { useState, useEffect } from "react";
import { Button, Col, Dropdown, DropdownHeader, Form, FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "./Dropdown.css";

const SignInField = ({
	type,
	placeholder,
	className,
	value,
	onChange,
	autoComplete,
	style,
}) => (
	<FormControl
		type={type}
		placeholder={placeholder}
		className={className}
		value={value}
		onChange={onChange}
		autoComplete={autoComplete}
		style={style}
	/>
);

const DropdownMenu = ({
	user,
	handleSignOut,
	handleResetPassword,
	email,
	setEmail,
	password,
	setPassword,
	inputClass,
	isDarkTheme,
	handleLogin,
	handleSignUp,
	loginError,
  }) => {
	useEffect(() => {
	  // Function now sets class-based styling for placeholders
	  setPlaceholderStyles(isDarkTheme);
  
	  // Retrieve userEmail from localStorage and set it as the initial email state
	  const userEmail = localStorage.getItem('userEmail');
	  if (userEmail) {
		setEmail(userEmail);
	  }
	}, [isDarkTheme, setEmail]);

	// Removed individual style objects in favor of className logic
	const themeClass = isDarkTheme ? "dark-theme" : "light-theme";

	// Moved placeholder style adjustments to a function that toggles class names
	const setPlaceholderStyles = (isDarkTheme) => {
		document.documentElement.className = isDarkTheme
			? "dark-theme"
			: "light-theme";
	};

	const modifiedHandleSignOut = () => {
		localStorage.removeItem('userEmail'); // Clear user email from localStorage on logout
		handleSignOut(); // Call the original sign out handler
	  };

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const handleDropdownToggle = (isOpen, event, metadata) => {
		setIsDropdownOpen(isOpen);
	};

	return (
		<>
			{isDropdownOpen && <div className="blur-overlay"></div>}
			<Dropdown onToggle={handleDropdownToggle} style={{zIndex:"999"}}>
				<Dropdown.Toggle
					variant="primary"
					id="dropdown-basic"
					className={`dropdown-toggle ${themeClass}`}
					
				>
					{user ? <FontAwesomeIcon icon={faUser} /> : "Sign In"}
				</Dropdown.Toggle>

				<Dropdown.Menu className={`dropdown-menu ${themeClass}`}>
					{user ? (
						<>
							{/* <Dropdown.Item className="dropdown-loggedin-options" href="#/action-1">Action</Dropdown.Item>
						<Dropdown.Item className="dropdown-loggedin-options" href="#/action-2">Another action</Dropdown.Item> */}
							<DropdownHeader style={{color: "white", alignItems:"center"}}>
								Logged in as:   <em>{localStorage.getItem('userEmail')}</em>
							</DropdownHeader>
							<Button
								type="button"
								variant="outline-danger"
								onClick={modifiedHandleSignOut}
								className="logout-button"
								
							>
								Logout
							</Button>
						</>
					) : (
						<Form
							inline={true}
							className="ml-auto"
							onSubmit={(e) => e.preventDefault()}
						>
							<SignInField
								type="email"
								placeholder="Email"
								className={`mr-sm-2 ${inputClass} ${themeClass}`}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								autoComplete="email"
							/>
							<SignInField
								type="password"
								placeholder="Password"
								className={`mr-sm-2 ${inputClass} ${themeClass}`}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								autoComplete="current-password"
							/>
							<Col xs="auto">
								<div className="d-flex"></div>
								<Button
									variant="outline-success"
									className="mr-2 log-in-button"
									onClick={() => {
										handleLogin(email, password);
									  }}
								>
									Log In
								</Button>
								
								<Button
									variant="outline-primary"
									className="sign-up-button"
									onClick={handleSignUp}
								>
									Sign Up
								</Button>

							</Col>
							{loginError && <div className="text-danger mt-2" style={{textAlign: "center"}}>Login failed. Please try again.</div>}
							<Dropdown.Item
								onClick={handleResetPassword}
								className="forgot-password"
							>
								Forgot Password?
							</Dropdown.Item>
						</Form>
					)}
				</Dropdown.Menu>
			</Dropdown>
		</>
	);
};

export default DropdownMenu;
