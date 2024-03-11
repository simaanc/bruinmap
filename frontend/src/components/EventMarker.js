import React from "react";
import { Marker, Popup } from "react-leaflet";
import customMarkerImg from "../Assets/map-marker-icon.png";
import L from "leaflet";
import { useAuth } from "../Context/AuthContext";

const EventMarker = ({ marker, onSaveEvent }) => {
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
			<Popup>
				<h3>{marker.name}</h3>
				<p>{marker.description}</p>
				<p>Date: {marker.date}</p>
				<p>Time: {marker.time}</p>

				<div>
					{!user ? (
						<p>Sign in to save!</p>
					) : (
						<button onClick={handleSaveEvent}>Save Event</button>
					)}
				</div>
			</Popup>
		</Marker>
	);
};
export default EventMarker;
