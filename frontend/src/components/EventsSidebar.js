import React, { useEffect, useState } from "react";
import { db } from "../firebase.config";
import { useAuth } from "../Context/AuthContext";
import "./Sidebar.css";
import { EventData } from "./EventsData";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { faArrowLeft, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EventsSidebar = ({ sidebar, showSidebar, eventsSidebar, showEventsSidebar, eventsSidebarFromSidebar, setEventsSidebarFromSidebar, isLoggedIn }) => {
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

				// Get a reference to the user's document in Firestore
				const userDocRef = db.collection("users").doc(user.uid);

				// Get the user's document from Firestore
				const userDocSnapshot = await userDocRef.get();

				// Get the events array from the user's document
				const events = userDocSnapshot.data().events || [];

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
			<nav className={eventsSidebar ? "sidebar-menu active" : "sidebar-menu"} >
				{/* Shows an 'X' if the main sidebar isn't open, or a left arrow if the main sidebar is open */}
				<button
					class="event-sidebar-button"
					onClick={() => eventsSidebarFromSidebar ? (showSidebar(), showEventsSidebar(), setEventsSidebarFromSidebar()) : showEventsSidebar()}
				>
					{eventsSidebarFromSidebar ? (
						<FontAwesomeIcon
							icon={faArrowLeft}
							className="fa-icon"
						/>
					) : (
						<FontAwesomeIcon
							icon={faX}
							className="fa-icon"
						/>
					)}
				</button>

				<ul className="sidebar-menu-items event-options" onClick={showEventsSidebar}
				>
					{/* Event Sidebar Items */}
					{EventData
						// First, filter out protected items if not logged in
						.filter(item => isLoggedIn || !item.protected)
						// Then, sort so that if logged in, protected items come first
						.sort((a, b) => {
							// When logged in, push protected items to the front
							if (isLoggedIn) {
								return a.protected === b.protected ? 0 : a.protected ? -1 : 1;
							}
							// If not logged in, this part won't be reached due to filter,
							// but keep it for logical completeness
							return 0;
						})
						.map((item, index) => {
							// Render sidebar items
							return (
								<li key={index} className={item.cName}>
									<Link to={item.path}>
										{item.icon}
										<span>{item.title}</span>
									</Link>
								</li>
							);
						})
					}

				</ul>
			</nav>
		</div >
	);
};

export default EventsSidebar;
