import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import "./EventSidebar.css";
import { faArrowLeft, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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
        const response = await axios.get(`${API_BASE_URL}/api/auth/events`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
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
        const response = await axios.get(`${API_BASE_URL}/events`);
        const events = response.data;

        console.log("All events:", events);
        console.log("Array check:", Array.isArray(events));

        // Set the allEvents state to the events array
        setAllEvents(events);
      } catch (error) {
        console.error("Error fetching all events:", error);
      }
    };

    // Fetch user events and all events when the eventsSidebar prop changes
    if (eventsSidebar) {
      fetchUserEvents();
      fetchAllEvents();
    }
  }, [user, eventsSidebar]);

  // Filter out user's saved events from all events
  const nonSavedEvents = allEvents.filter(
    (event) => !userEvents.some((savedEvent) => savedEvent._id === event._id)
  );

  const handleEventClick = (event) => {
    window.dispatchEvent(new CustomEvent("eventClick", { detail: event }));
  };

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
          }>
          {eventsSidebarFromSidebar ? (
            <FontAwesomeIcon icon={faArrowLeft} className="fa-icon" />
          ) : (
            <FontAwesomeIcon icon={faX} className="fa-icon" />
          )}
        </button>
        <ul
          className="sidebar-menu-items event-options"
          onClick={showEventsSidebar}>
          {/* Conditionally render Saved Events based on isLoggedIn */}
          {isLoggedIn && (
            <li className="event-text">
              <h2 className="event-header-text" style={{ marginTop: "24px" }}>
                Saved Events
              </h2>
              {Array.isArray(userEvents) && userEvents.length > 0 ? (
                <ul>
                  {userEvents.map((event, index) => (
                    <li key={index} onClick={() => handleEventClick(event)}>
                      {event.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No saved events</p>
              )}
            </li>
          )}

          <li className="event-text">
            <h2 className="event-header-text">All Events</h2>
            {nonSavedEvents.length > 0 ? (
              <ul>
                {nonSavedEvents.map((event, index) => (
                  <li key={index} onClick={() => handleEventClick(event)}>
                    {event.name}
                  </li>
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
