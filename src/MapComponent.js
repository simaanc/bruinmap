import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, useMap, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Function to calculate the center of a polygon
const calculateCenter = (coords) => {
  const latitudes = coords.map((coord) => coord[0]);
  const longitudes = coords.map((coord) => coord[1]);
  const avgLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
  const avgLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
  return [avgLat, avgLng];
};

const DivIcon = ({ positions, text }) => {
  const map = useMap();

  useEffect(() => {

    // Function to calculate the bounds of the polygon in pixels
    const calculatePolygonPixelBounds = (positions) => {
      const points = positions.map((pos) =>
        map.latLngToLayerPoint(L.latLng(pos))
      );
      const xValues = points.map((p) => p.x);
      const yValues = points.map((p) => p.y);
      const minX = Math.min(...xValues);
      const maxX = Math.max(...xValues);
      const minY = Math.min(...yValues);
      const maxY = Math.max(...yValues);
      return { width: maxX - minX, height: maxY - minY };
    };

    let label = null;

	const updateLabelVisibility = () => {
		const currentZoom = map.getZoom();
		const center = calculateCenter(positions);
	  
		if (label && currentZoom <= 19) {
		  label.remove();
		  label = null;
		} else if (!label && currentZoom > 19) {
		  const polygonBounds = calculatePolygonPixelBounds(positions);
		  // Corrected call to getDivIcon with the right parameters
		  label = L.marker(center, {
			icon: getDivIcon(text, polygonBounds), // Ensure 'text' is correctly passed as a string
		  }).addTo(map);
		}
	  };

    updateLabelVisibility();
    map.on("zoomend", updateLabelVisibility);

    return () => {
      map.off("zoomend", updateLabelVisibility);
      if (label) {
        label.remove();
      }
    };
  }, [map, positions, text]);

  return null;
};

const getDivIcon = (text, bounds) => {
	const maxSize = Math.min(bounds.width, bounds.height) / 2;
	const fontSize = Math.min(12, maxSize / 3); // Ensure font size is not too large
  
	return L.divIcon({
		className: "custom-div-icon",
		html: `
		  <div style="
			display: flex;
			justify-content: center;
			align-items: center;
			width: ${maxSize}px; 
			height: ${maxSize / 5}px;
			background: transparent;
			border: none;
			font-size: ${fontSize}px;
			text-align: center; /* Center text horizontally */
		  ">
			${text}
		  </div>
		`,
		iconSize: [maxSize, maxSize / 5],
	});
  };

const roomStyle = {
  color: "blue",
  fillColor: "#f0e6ff",
  fillOpacity: 1,
  weight: 1,
};

// Example room coordinates for different floors at Boelter Hall
const floorData = [
  {
    name: "Floor 1",
    rooms: [
      {
        name: "Room 1F",
        coords: [
          [34.068477144450085, -118.44340842768426],
          [34.06847641055582, -118.4425360090241],
          [34.06927886408003, -118.44254954177468],
          [34.06926485157086, -118.44342353246515],
        ],
        content: "Details about Room 1 on Floor 1",
      },
      // Add more rooms for Floor 1
    ],
  },
  {
    name: "Floor 2",
    rooms: [
      {
        name: "Room 2F",
        coords: [
          [34.0691, -118.4436],
          [34.0692, -118.4436],
          [34.0692, -118.4435],
          [34.0691, -118.4435],
        ],
        content: "Details about Room 1 on Floor 2",
      },
      // Add more rooms for Floor 2
    ],
  },
];

const FloorPlan = () => {
  const [currentFloor, setCurrentFloor] = useState(floorData[0].name);

  const handleFloorChange = (event) => {
    setCurrentFloor(event.target.value);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Floor switcher UI positioned at the top right */}
      <div
        style={{
          position: "absolute",
          zIndex: 1000,
          background: "white",
          padding: "10px",
          top: "10px", // Adjust as needed
          right: "10px", // Adjust as needed
          borderRadius: "5px", // Optional, for rounded corners
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)", // Optional, for shadow effect
        }}>
        <select
          onChange={handleFloorChange}
          value={currentFloor}
          style={{ padding: "5px", borderRadius: "5px" }}>
          {floorData.map((floor) => (
            <option key={floor.name} value={floor.name}>
              {floor.name}
            </option>
          ))}
        </select>
      </div>
      <MapContainer
        center={[34.0689, -118.4436]}
        zoom={18}
        style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
		  maxNativeZoom = {18}
          maxZoom={20}
        />
        {floorData
          .filter((floor) => floor.name === currentFloor)
          .flatMap((floor) =>
            floor.rooms.map((room, idx) => (
              <Polygon
                key={`${idx}`}
                pathOptions={roomStyle}
                positions={room.coords}>
                <Popup>{room.content}</Popup>
                <DivIcon positions={room.coords} text={room.name} />
              </Polygon>
            ))
          )}
      </MapContainer>
    </div>
  );
};

export default FloorPlan;
