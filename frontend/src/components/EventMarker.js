import React from "react";
import { Marker, Popup } from "react-leaflet";
import customMarkerImg from "../Assets/map-marker-icon.png";
import L from "leaflet";
import { useAuth } from "../Context/AuthContext";
import { Button } from "react-bootstrap";
import "./Event.css";

const EventMarker = ({ marker, onSaveEvent, isDarkTheme }) => {
	const { user } = useAuth();
	const handleSaveEvent = () => {
		onSaveEvent(marker);
	};

	const customIcon = L.divIcon({
		className: "custom-icon",
		html: `<img src="${customMarkerImg}" alt="Custom Marker Icon" style="height: 30px; width: auto;">`,
	});

	return (
		<Marker position={marker.position} icon={customIcon}>
			<Popup className="event-popup">
				<h3>{marker.name}</h3>
				<p>{marker.description}</p>
				<p>Date: {marker.date}</p>
				<p>Time: {marker.time}</p>

				<div>
					{!user ? (
						<p>Sign in to save!</p>
					) : (
						<Button type="button" className="outline-primary event-button" onClick={handleSaveEvent}>Save Event</Button>
					)}
				</div>
			</Popup>
		</Marker>
	);
};
export default EventMarker;
