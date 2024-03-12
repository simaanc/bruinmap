import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import "./Sidebar.css";
import { EventData } from "./EventsData";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { faArrowLeft, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

const EventsSidebar = ({
	sidebar,
	showSidebar,
	eventsSidebar,
	showEventsSidebar,
	eventsSidebarFromSidebar,
	setEventsSidebarFromSidebar,
	isLoggedIn,
}) => {
	const { user } = useAuth();
	const [userEvents, setUserEvents] = useState([]);

	useEffect(() => {
		const fetchUserEvents = async () => {
			try {
				// Check if the user is logged in
				if (!user) {
					console.error("User is not logged in.");
					return;
				}

				// Make an API request to fetch the user's events from the server
				const response = await axios.get(
					"http://localhost:5000/api/auth/events",
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}
				);
				const events = response.data;

				// Set the userEvents state to the events array
				setUserEvents(events);
			} catch (error) {
				console.error("Error fetching user events:", error);
			}
		};

		fetchUserEvents();
	}, [user]);

	return (
		<div className="event-sidebar">
			{/* Sidebar */}
			<nav className={eventsSidebar ? "sidebar-menu active" : "sidebar-menu"}>
				{/* Shows an 'X' if the main sidebar isn't open, or a left arrow if the main sidebar is open */}
				<button
					className="event-sidebar-button"
					onClick={() =>
						eventsSidebarFromSidebar
							? (showSidebar(),
							  showEventsSidebar(),
							  setEventsSidebarFromSidebar())
							: showEventsSidebar()
					}
				>
					{eventsSidebarFromSidebar ? (
						<FontAwesomeIcon icon={faArrowLeft} className="fa-icon" />
					) : (
						<FontAwesomeIcon icon={faX} className="fa-icon" />
					)}
				</button>
				<ul
					className="sidebar-menu-items event-options"
					onClick={showEventsSidebar}
				>
					{/* Sidebar Items */}
					{EventData.filter((item) => !item.protected || isLoggedIn).map(
						(item, index) => {
							if (item.type === "gitHubButton") {
								// Render the SearchBar component for this special case
								return (
									<li key={index} className={item.cName}>
										<h2>Saved Events</h2>
										<ul>
											{userEvents.map((event, index) => (
												<li key={index}>{event.title}</li>
											))}
										</ul>
									</li>
								);
							} else {
								// Render normal sidebar items
								return (
									<li key={index} className={item.cName}>
										<Link to={item.path}>
											{item.icon}
											<span>{item.title}</span>
										</Link>
									</li>
								);
							}
						}
					)}
				</ul>
			</nav>
		</div>
	);
};

export default EventsSidebar;
