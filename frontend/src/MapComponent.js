import React, { useEffect, useState, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Polygon, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

const calculateCenter = (coords) => {
  const latitudes = coords.map((coord) => coord[0]);
  const longitudes = coords.map((coord) => coord[1]);
  const avgLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
  const avgLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
  return [avgLat, avgLng];
};

const DivIcon = ({ positions, text, isVisible, onIconClick }) => {
  const map = useMap();

  // Memoize calculatePolygonPixelBounds using useCallback
  const calculatePolygonPixelBounds = useCallback(() => {
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
  }, [map, positions]); // Dependencies are map and positions, as they're used within the function.

  useEffect(() => {
    let label = null;

    const center = calculateCenter(positions);
    const polygonBounds = calculatePolygonPixelBounds();

    const createOrUpdateLabel = () => {
      if (isVisible) {
        if (!label) {
          const icon = L.divIcon({
            className: "custom-div-icon",
            html: `<div style="display: flex; justify-content: center; align-items: center; width: ${
              polygonBounds.width
            }px; height: ${
              polygonBounds.height / 5
            }px; background: transparent; border: none; font-size: 12px; text-align: center;">${text}</div>`,
            iconSize: [polygonBounds.width, polygonBounds.height / 5],
          });

          label = L.marker(center, { icon }).addTo(map);

          // Attach a click event listener to the icon
          L.DomEvent.on(label._icon, "click", (e) => {
            e.stopPropagation();
            if (onIconClick) onIconClick(); // Use the passed onIconClick function
          });
        }
      } else if (label) {
        // Remove the event listener when the component is not visible or being removed
        L.DomEvent.off(label._icon, "click");
        label.remove();
        label = null;
      }
    };

    createOrUpdateLabel();

    map.on("zoomend", createOrUpdateLabel);

    return () => {
      if (label) {
        L.DomEvent.off(label._icon, "click");
        label.remove();
      }
      map.off("zoomend", createOrUpdateLabel);
    };
  }, [
    map,
    positions,
    text,
    isVisible,
    calculatePolygonPixelBounds,
    onIconClick,
  ]);

  return null;
};

const roomStyle = {
  color: "blue",
  fillColor: "#f0e6ff",
  fillOpacity: 0.7,
  weight: 1,
};

const buildingStyle = {
  color: "white",
  fillColor: "white",
  fillOpacity: 1,
  weight: 1,
};

// Abstracted custom hook for fetching building data
function useBuildingData() {
  const [buildingData, setBuildingData] = useState([]);

  useEffect(() => {
    async function fetchBuildingData() {
      try {
        const response = await axios.get("http://localhost:5000/buildings");
        setBuildingData(response.data);
      } catch (error) {
        console.error("Failed to fetch building data:", error);
      }
    }
    fetchBuildingData();
  }, []);

  return buildingData;
}

// Floor Selector Component
const FloorSelector = ({ selectedBuilding, selectedFloor, onChange }) => (
  <div style={floorSelectorStyle}>
    <select onChange={onChange} value={selectedFloor} style={selectStyle}>
      {selectedBuilding.floors.map((floor, index) => (
        <option key={index} value={floor.name}>
          {floor.name}
        </option>
      ))}
    </select>
  </div>
);

// Abstract styles
const floorSelectorStyle = {
  position: "absolute",
  zIndex: 1000,
  background: "white",
  padding: "10px",
  top: "10px",
  right: "10px",
  borderRadius: "5px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
};

const selectStyle = {
  padding: "5px",
  borderRadius: "5px",
};

const BuildingPolygons = ({
  buildingData,
  handleBuildingClick,
  selectedBuilding,
  selectedFloor,
  zoomLevel,
}) =>
  buildingData.map((building, idx) => (
    <Polygon
      key={idx}
      pathOptions={buildingStyle}
      positions={building.coords}
      eventHandlers={{
        click: () => handleBuildingClick(building),
      }}>
      <DivIcon
        positions={building.coords}
        text={building.name}
        isVisible={
          (zoomLevel >= 16 && !selectedBuilding) ||
          (selectedBuilding && zoomLevel <= 19 && zoomLevel > 16)
        }
        onIconClick={() => handleBuildingClick(building)}
      />
      {selectedBuilding &&
        selectedFloor &&
        building.name === selectedBuilding.name &&
        zoomLevel > 19 &&
        selectedBuilding.floors
          .filter((floor) => floor.name === selectedFloor)
          .flatMap((floor) =>
            floor.rooms.map((room, roomIdx) => (
              <RoomPolygon
                key={`${floor.name}-${roomIdx}`}
                room={room}
                zoomLevel={zoomLevel}
              />
            ))
          )}
    </Polygon>
  ));

const RoomPolygon = ({ room, zoomLevel }) => {
  const popupRef = useRef(null); // Reference to the Popup

  // Function to programmatically open  Popup
  const openPopup = useCallback(() => {
    console.log("Attempting to open popup"); // Debug log
    if (popupRef.current) {
      popupRef.current.openPopup();
    }
  }, []);

  useEffect(() => {
    if (zoomLevel > 19) {
      setTimeout(openPopup, 1000); // Add a delay of 1 second
    }
  }, [zoomLevel, openPopup]);

  return (
    <Polygon pathOptions={roomStyle} positions={room.coords}>
      <Popup ref={popupRef}>
        <div>
          <h2>{room.name}</h2>
          <p>{room.content}</p>
          <p>
            <b>Building:</b> {room.building}
          </p>
        </div>
      </Popup>
      <DivIcon
        positions={room.coords}
        text={room.name}
        isVisible={zoomLevel > 19}
        onIconClick={openPopup} // Pass openPopup as callback
      />
    </Polygon>
  );
};

const MapComponent = () => {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(18);
  const mapRef = useRef(null);
  const buildingData = useBuildingData();

  const handleBuildingClick = useCallback((building) => {
    const sortedFloors = [...building.floors].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setSelectedBuilding({ ...building, floors: sortedFloors });
    setSelectedFloor(sortedFloors[0]?.name || null);

    if (mapRef.current) {
      const center = calculateCenter(building.coords);
      mapRef.current.setView(center, 20);
    }
  }, []);

  const handleFloorChange = useCallback((event) => {
    setSelectedFloor(event.target.value);
  }, []);

  return (
    <div style={{ display: "flex", height: "99vh" }}>
      {selectedBuilding && (
        <FloorSelector
          selectedBuilding={selectedBuilding}
          selectedFloor={selectedFloor}
          onChange={handleFloorChange}
        />
      )}
      <MapContainer
        center={[34.0689, -118.4436]} // Center on UCLA
        zoom={zoomLevel}
        style={{ height: "100%", width: "100%" }}
        minZoom={17} // Set minimum zoom level to 10
        maxBounds={[
          [34.05739224021787, -118.4550923280393], // Southwest coordinates
          [34.07901051913227, -118.43740076782235], // Northeast coordinates
        ]}
        whenReady={(mapInstance) => {
          mapRef.current = mapInstance.target; // Store the map instance in ref
          mapInstance.target.on("zoomend", () => {
            const newZoomLevel = mapInstance.target.getZoom();
            setZoomLevel(newZoomLevel);
            console.log("Current zoom level:", newZoomLevel); // Log the current zoom level
          });
        }}>
        {/* TileLayer and other components remain the same */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxNativeZoom={18}
          maxZoom={24}
        />

        <BuildingPolygons
          buildingData={buildingData}
          handleBuildingClick={handleBuildingClick}
          selectedBuilding={selectedBuilding}
          selectedFloor={selectedFloor}
          zoomLevel={zoomLevel}
        />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
