import React, { useEffect } from "react";
import { Button, Col, Dropdown, Form, FormControl } from "react-bootstrap";
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
	buttonStyle,
	isDarkTheme,
	handleLogin, // Passed from Navbar.js
	handleSignUp, // Passed from Navbar.js
}) => {
	useEffect(() => {
		// Function now sets class-based styling for placeholders
		setPlaceholderStyles(isDarkTheme);
	}, [isDarkTheme]);

	// Removed individual style objects in favor of className logic
	const themeClass = isDarkTheme ? "dark-theme" : "light-theme";

	// Moved placeholder style adjustments to a function that toggles class names
	const setPlaceholderStyles = (isDarkTheme) => {
		document.documentElement.className = isDarkTheme
			? "dark-theme"
			: "light-theme";
	};

	return (
		<Dropdown>
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
						<Dropdown.Item href="#/action-1">Action</Dropdown.Item>
						<Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
						<Button
							type="button"
							variant="outline-danger"
							onClick={handleSignOut}
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
								className="mr-2"
								onClick={handleLogin}
							>
								Log In
							</Button>
							<Button variant="outline-primary" onClick={handleSignUp}>
								Sign Up
							</Button>
						</Col>
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
	);
};

export default DropdownMenu;