import React, { useState, useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import Routing from "./Routing"; // Ensure this is imported correctly

// Correct the paths to the marker images
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
	iconUrl: require("leaflet/dist/images/marker-icon.png"),
	shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapComponent = () => {
	// Declare currentPosition and setCurrentPosition using useState
	const [currentPosition, setCurrentPosition] = useState(null);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setCurrentPosition([
					position.coords.latitude,
					position.coords.longitude,
				]);
			},
			(error) => {
				console.error("Error fetching location:", error);
				// Fallback or notify user
			},
			{ timeout: 5000, enableHighAccuracy: true } // Adjust these values as needed
		);
	}, []);

	if (!currentPosition) {
		return <div>Loading or please allow location access...</div>;
	}

	return (
		<MapContainer
			center={currentPosition}
			zoom={13}
			scrollWheelZoom={true}
			style={{ height: "100vh", width: "100%" }}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<Routing startPosition={currentPosition} />
		</MapContainer>
	);
};

export default MapComponent;
