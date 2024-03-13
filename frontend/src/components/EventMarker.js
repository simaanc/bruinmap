import React, { useEffect, useRef, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import customMarkerImg from "../Assets/map-marker-icon.png";
import L from "leaflet";
import { useAuth } from "../Context/AuthContext";
import { Button } from "react-bootstrap";
import "./Event.css";

const EventMarker = ({ marker, onSaveEvent, selectedEvent }) => {
  const { user } = useAuth();
  const markerRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleSaveEvent = () => {
    onSaveEvent(marker);
  };

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
          ) : (
            <Button
              type="button"
              className="outline-primary event-button"
              onClick={handleSaveEvent}
            >
              Save Event
            </Button>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default EventMarker;