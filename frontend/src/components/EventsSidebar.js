import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
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
	const [allEvents, setAllEvents] = useState([]);

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
				const events = response.data.events;

				console.log("User events:", events);
				console.log("Array check:", Array.isArray(events));

				// Set the userEvents state to the events array
				setUserEvents(events);
			} catch (error) {
				console.error("Error fetching user events:", error);
			}
		};

		const fetchAllEvents = async () => {
			try {
				// Make an API request to fetch all events from the server
				const response = await axios.get("http://localhost:5000/events");
				const events = response.data;

				console.log("All events:", events);
				console.log("Array check:", Array.isArray(events));

				// Set the allEvents state to the events array
				setAllEvents(events);
			} catch (error) {
				console.error("Error fetching all events:", error);
			}
		};

		fetchUserEvents();
		fetchAllEvents();
	}, [user]);

	// Filter out user's saved events from all events
	const nonSavedEvents = allEvents.filter(
		(event) => !userEvents.some((savedEvent) => savedEvent._id === event._id)
	);

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
					{/* Saved Events */}
					<li className="sidebar-text">
						<h2>Saved Events</h2>
						{Array.isArray(userEvents) && userEvents.length > 0 ? (
							<ul>
								{userEvents.map((event, index) => (
									<li key={index}>{event.name}</li>
								))}
							</ul>
						) : (
							<p>No saved events</p>
						)}
					</li>

					<li className="sidebar-text">
						<h2>All Events</h2>
						{nonSavedEvents.length > 0 ? (
							<ul>
								{nonSavedEvents.map((event, index) => (
									<li key={index}>{event.name}</li>
								))}
							</ul>
						) : (
							<p>No events available</p>
						)}
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default EventsSidebar;
