import { useEffect, useRef } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

const Routing = ({ startPosition }) => {
	const map = useMap();
	const routeRef = useRef(null); // Use a ref to keep track of the current route

	useEffect(() => {
		if (!map || !startPosition) return;

		const fetchWalkingRoute = async () => {
			const apiKey = process.env.REACT_APP_OPENROUTESERVICE_API_KEY;
			console.log("API key:", apiKey); // Log the API key
			const endPoint = [34.06886285, -118.4427817663084];
			const url = `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${apiKey}&start=${startPosition[1]},${startPosition[0]}&end=${endPoint[1]},${endPoint[0]}`;

			try {
				const response = await fetch(url);
				if (response.ok) {
					const data = await response.json();
					const coords = data.features[0].geometry.coordinates.map(
						([lng, lat]) => [lat, lng]
					);

					// Remove the previous route if it exists
					if (routeRef.current) {
						map.removeLayer(routeRef.current);
					}

					// Add the new route and save the reference
					routeRef.current = L.polyline(coords, { color: "blue" }).addTo(map);
					map.fitBounds(routeRef.current.getBounds());
				} else {
					console.error("Failed to fetch route:", response.statusText);
				}
			} catch (error) {
				console.error("Error fetching walking route:", error);
			}
		};

		fetchWalkingRoute();
	}, [map, startPosition]); // Depend on startPosition to re-fetch the route when it changes

	return null;
};

export default Routing;
