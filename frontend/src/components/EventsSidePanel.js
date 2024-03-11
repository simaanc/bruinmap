import React, { useEffect, useState } from "react";
import { db } from "../firebase.config";
import { useAuth } from "../Context/AuthContext";
import "./Sidebar.css";

const EventsSidePanel = () => {
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
		<div>
			{/* <h2>Saved Events</h2>
      <ul>
        {userEvents.map((eventId, index) => (
          <li key={index}>{eventId}</li>
        ))}
      </ul> */}

			<div>
				{/* Close button */}
				{/* <button className="close-btn" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faTimes} />
        </button> */}

				{/* Sidebar content */}
				<div className="events-sidebar-content">
					<h2>Saved Events</h2>
					<ul>
						{userEvents.map((eventId, index) => (
							<li key={index}>{eventId}</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default EventsSidePanel;
