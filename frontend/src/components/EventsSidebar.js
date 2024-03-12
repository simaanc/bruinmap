import React, { useEffect, useState } from "react";
import { db } from "../firebase.config";
import { useAuth } from "../Context/AuthContext";
import "./Sidebar.css";
import { EventData } from "./EventsData";
import { Link } from "react-router-dom";

const EventsSidebar = ({eventsSidebar, showEventsSidebar, isLoggedIn}) => {
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
					<ul className="sidebar-menu-items" onClick={showEventsSidebar}
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
												{userEvents.map((eventId, index) => (
													<li key={index}>{eventId}</li>
												))}
											</ul>

										</li>

									);
								}
								else {
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
			</div >
	);
};

export default EventsSidebar;