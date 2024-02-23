import React, { useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

// Correct the paths to the marker images
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
	iconUrl: require("leaflet/dist/images/marker-icon.png"),
	shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Define a component to add routing
const Routing = () => {
	const map = useMap();

	useEffect(() => {
		if (!map) return;

		const routingControl = L.Routing.control({
			waypoints: [L.latLng(34.0699, -118.4438), L.latLng(34.0689, -118.4452)],
			routeWhileDragging: true,
		}).addTo(map);

		// Debugging: Log when the control is added
		console.log("Routing control added");
	}, [map]);

	return null;
};

const MapComponent = () => {
	return (
		<MapContainer
			center={[34.0699, -118.4438]}
			zoom={13}
			scrollWheelZoom={true}
			style={{ height: "100vh", width: "100%" }}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<Routing />
		</MapContainer>
	);
};

export default MapComponent;
