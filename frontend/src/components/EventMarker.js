import React, { useEffect, useRef, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import customMarkerImg from "../Assets/map-marker-icon.png";
import L from "leaflet";
import { useAuth } from "../Context/AuthContext";
import { Button } from "react-bootstrap";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const EventMarker = ({
  marker,
  selectedEvent,
  onPopupClose,
  handleSaveEvent,
  handleDeleteEvent,
}) => {
  const { user } = useAuth();
  const markerRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEventSaved, setIsEventSaved] = useState(false);
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        if (!user) {
          console.error("User is not logged in.");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/auth/events`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const events = response.data.events;

        setUserEvents(events);
        setIsEventSaved(events.some((savedEvent) => savedEvent._id === marker._id));
      } catch (error) {
        console.error("Error fetching user events:", error);
      }
    };

    fetchUserEvents();
  }, [user, marker]);

  const handleMarkerClick = () => {
    if (markerRef.current) {
      markerRef.current.openPopup();
      setIsPopupOpen(true);
    }
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    if (selectedEvent && selectedEvent._id === marker._id && markerRef.current) {
      markerRef.current.openPopup();
      setIsPopupOpen(true);
    }
  }, [selectedEvent, marker]);

  const customIcon = L.divIcon({
    className: "custom-icon",
    html: `<img src="${customMarkerImg}" alt="Custom Marker Icon" style="height: 30px; width: auto;">`,
  });

  const SaveEventButton = () => (
    <Button
      type="button"
      className="outline-primary event-button"
      onClick={() => handleSaveEvent(marker, () => setIsEventSaved(true))}
    >
      Save Event
    </Button>
  );

  const DeleteEventButton = () => (
    <Button
      variant="danger"
      type="button"
      className="outline-primary event-button"
      onClick={() => handleDeleteEvent(marker, () => setIsEventSaved(false))}
    >
      Delete Event
    </Button>
  );

  return (
    <Marker
      position={[marker.coords[0], marker.coords[1]]}
      icon={customIcon}
      ref={markerRef}
      eventHandlers={{
        click: handleMarkerClick,
      }}
    >
      <Popup className="event-popup" onClose={handlePopupClose}>
        <h3>{marker.name}</h3>
        <p>{marker.details}</p>
        <p>Date: {new Date(marker.time).toLocaleDateString()}</p>
        <p>Time: {new Date(marker.time).toLocaleTimeString()}</p>
        <div>
          {!user ? (
            <p>Sign in to save!</p>
          ) : isEventSaved ? (
            <DeleteEventButton />
          ) : (
            <SaveEventButton />
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default EventMarker;