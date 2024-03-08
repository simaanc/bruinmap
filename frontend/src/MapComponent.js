import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Popup,
  Pane,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import polylabel from '@mapbox/polylabel';


const calculateCenter = (coords) => {
  // Guard clause to handle undefined or empty coords array
  if (!coords || coords.length === 0) {
    console.warn(
      "calculateCenter was called with undefined or empty coords array"
    );
    return [0, 0]; // Return a default value or handle this case as needed
  }

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
  color: "grey",
  fillColor: "white",
  fillOpacity: 0.7,
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
  top: "70px", // Adjust based on the actual height of the Search Bar + desired margin
  right: "10px",
  borderRadius: "5px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
};

const selectStyle = {
  padding: "5px",
  borderRadius: "5px",
};

// Building Polygons Component
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

// Room Polygon Component
const RoomPolygon = ({ room, zoomLevel }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleMouseOver = useCallback(() => {
    setShowPopup(true);
  }, []);

  const handleMouseOut = useCallback(() => {
    setShowPopup(false);
  }, []);

  return (
    <Polygon
      pathOptions={roomStyle}
      positions={room.coords}
      eventHandlers={{
        mouseover: handleMouseOver,
        mouseout: handleMouseOut,
      }}>
      {showPopup && (
        <Popup>
          <div>
            <h2>{room.name}</h2>
            <p>{room.content}</p>
            <p>
              <b>Building:</b> {room.building}
            </p>
          </div>
        </Popup>
      )}
      <DivIcon
        positions={room.coords}
        isVisible={zoomLevel > 19}
        text={room.name}
      />
    </Polygon>
  );
};

const PolygonDrawer = () => {
  const [polygonPoints, setPolygonPoints] = useState([]);

  useMapEvents({
    click: (e) => {
      const newPoint = [e.latlng.lat, e.latlng.lng];
      setPolygonPoints((points) => [...points, newPoint]);
    },
    dblclick: () => {
      // Output the polygon points to the console
      console.log(polygonPoints);
      // Optionally, reset the polygonPoints to start drawing a new polygon
      setPolygonPoints([]);
    },
  });

  return polygonPoints.length > 0 ? (
    <Polygon positions={polygonPoints} />
  ) : null;
};

function MapClickLogger() {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      console.log(`Clicked at latitude: ${lat}, longitude: ${lng}`);
    },
  });

  return null; // This component does not render anything.
}

// Search Bar Component
const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div style={searchBarStyle}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search for a room..."
          value={searchTerm}
          onChange={handleChange}
          style={searchInputStyle}
        />
        <button type="submit" style={searchButtonStyle}>
          Search
        </button>
      </form>
    </div>
  );
};

// Search Bar Styles
const searchBarStyle = {
  position: "absolute",
  zIndex: 1000,
  background: "white",
  padding: "10px",
  top: "10px",
  right: "10px",
  borderRadius: "5px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
};

const searchInputStyle = {
  padding: "5px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const searchButtonStyle = {
  padding: "5px 10px",
  borderRadius: "5px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const MouseCoordinateDisplay = () => {
  const [coords, setCoords] = useState([0, 0]);

  useMapEvents({
    mousemove: (e) => {
      setCoords([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: "50px",
        right: "10px",
        zIndex: 1000,
        background: "white",
        padding: "8px",
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      }}>
      Lat: {coords[0].toFixed(7)}, Lng: {coords[1].toFixed(7)}
    </div>
  );
};

const SearchResultsOverlay = ({ searchResults }) => {
  return (
    <Pane name="search-results" style={{ zIndex: 1000 }}>
      {searchResults.map((result, idx) => (
        <Polygon
          key={idx}
          positions={result.coords}
          pathOptions={{
            color: "red",
            fillColor: "red",
            fillOpacity: 0.5,
            weight: 2,
          }}></Polygon>
      ))}
    </Pane>
  );
};

// Map Component
const MapComponent = () => {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(18);
  const [searchResults, setSearchResults] = useState([]);
  const mapRef = useRef(null);
  const buildingData = useBuildingData();

  const handleBuildingClick = useCallback((building) => {
    const sortedFloors = [...building.floors].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setSelectedBuilding({ ...building, floors: sortedFloors });
    setSelectedFloor(sortedFloors[0]?.name || null);
    setSearchResults([]);

    if (mapRef.current) {
      const center = calculateCenter(building.coords);
      mapRef.current.setView(center, 20);
    }
  }, []);

  const handleFloorChange = useCallback(
    (event) => {
      const newFloor = event.target.value;
      if (newFloor !== selectedFloor) {
        setSelectedFloor(newFloor);
        setSearchResults([]); // Clear search results when switching floors
      }
    },
    [selectedFloor]
  );

  const handleSearch = useCallback(
    (searchTerm) => {
      if (searchTerm.trim() !== "" && selectedBuilding) {
        // Initialize a variable to store the first matching floor name if found
        let firstMatchingFloorName = null;

        const results = selectedBuilding.floors.flatMap((floor) => {
          const matchingRooms = floor.rooms.filter(
            (room) =>
              room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              room.content.toLowerCase().includes(searchTerm.toLowerCase())
          );

          // If there are matching rooms and no floor has been recorded yet, record this floor
          if (matchingRooms.length > 0 && !firstMatchingFloorName) {
            firstMatchingFloorName = floor.name;
          }

          return matchingRooms.map((room) => ({
            ...room,
            building: selectedBuilding.name,
            floor: floor.name,
          }));
        });

        setSearchResults(results);

        // If a matching floor was found, update the selected floor to this floor
        if (firstMatchingFloorName) {
          setSelectedFloor(firstMatchingFloorName);
        }
      } else {
        setSearchResults([]); // Clear search results if search term is empty or no building is selected
      }
    },
    [selectedBuilding]
  );

  return (
    <div style={{ display: "flex", height: "99vh" }}>
      {selectedBuilding && (
        <>
          <FloorSelector
            selectedBuilding={selectedBuilding}
            selectedFloor={selectedFloor}
            onChange={handleFloorChange}
          />
          <SearchBar onSearch={handleSearch} />
        </>
      )}
      <MapContainer
        center={[34.0689, -118.4436]} // Center on UCLA
        zoom={zoomLevel}
        style={{ height: "100%", width: "100%" }}
        minZoom={17} // Set minimum zoom level to 17
        maxBounds={[
          [34.05739224021787, -118.4550923280393], // Southwest coordinates
          [34.07901051913227, -118.43740076782235], // Northeast coordinates
        ]}
        whenCreated={(map) => {
          map.createPane("tooltipPane");
          map.getPane("tooltipPane").style.zIndex = 650; // Panes for overlays like tooltips have a default z-index of 625, so 650 places it above.
          map.getPane("tooltipPane").style.pointerEvents = "none"; // This ensures that the pane doesn’t interfere with mouse events.
        }}
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

        {/* Render search results as rectangles */}
        <SearchResultsOverlay searchResults={searchResults} />

        <MouseCoordinateDisplay />
        <MapClickLogger />
      </MapContainer>
    </div>
  );
};

export default MapComponent;