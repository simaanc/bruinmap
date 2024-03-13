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
import EventMarker from "./EventMarker";
import { useAuth } from "../Context/AuthContext";
import { useThemeDetector } from "./utils";
import polylabel from "polylabel";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const calculatePolygonPixelBounds = (map, positions) => {
  const points = positions.map((pos) => map.latLngToLayerPoint(L.latLng(pos)));
  const xValues = points.map((p) => p.x);
  const yValues = points.map((p) => p.y);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  return { width: maxX - minX, height: maxY - minY };
};

const DivIcon = ({ positions, text, isVisible, onIconClick, building, zoomLevel }) => {
  const map = useMap();

  useEffect(() => {
    if (!isVisible || !positions || positions.length === 0) {
      return;
    }

    // Use the external calculatePolygonPixelBounds function.
    const polygonBounds = calculatePolygonPixelBounds(map, positions);

    // Use the center from the building if available and valid, otherwise use polylabel to calculate the center
    const center = building && building.center && building.center.length === 2
      ? building.center
      : polylabel([positions], 1.0);

    // Calculate the appropriate font size based on the polygon bounds and zoom level
    const baseFontSize = Math.min(polygonBounds.width, polygonBounds.height) * 0.1;
    const fontSize = zoomLevel <= 18
      ? baseFontSize
      : Math.max(10, baseFontSize * (1 - (zoomLevel - 18) * 0.1));

    const iconHtml = `<div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; background: transparent; border: none; font-size: ${fontSize}px; text-align: center;">${text}</div>`;
    const icon = L.divIcon({
      html: iconHtml,
      className: "custom-div-icon", // Ensure this class is defined in your CSS
    });

    const marker = L.marker(center, { icon }).addTo(map);

    if (onIconClick) {
      marker.on("click", onIconClick);
    }

    return () => {
      marker.off("click", onIconClick);
      marker.remove();
    };
  }, [map, positions, text, isVisible, onIconClick, building, zoomLevel]);

  return null;
};

// Calculate the geographic center of a set of positions (ensure this function is defined or imported if it's moved outside too).

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
    let isSubscribed = true; // Flag to prevent updates if the component unmounts

    async function fetchBuildingData() {
      try {
        const response = await axios.get(`${API_BASE_URL}/buildings`);
        if (isSubscribed) {
          // Only update state if the component is still mounted
          setBuildingData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch building data:", error);
      }
    }

    fetchBuildingData();

    return () => {
      isSubscribed = false; // Set flag to false when the component unmounts
    };
  }, []);

  return buildingData;
}

const FloorSelector = ({ selectedBuilding, selectedFloor, onChange }) => {
  const theme = useThemeDetector(); // Use the hook within the component

  // Define getThemeStyle function within the component or make it accept `theme` as a parameter
  const getThemeStyle = (darkStyle, lightStyle) =>
    theme === "dark" ? darkStyle : lightStyle;

  // Now, you can safely use `getThemeStyle` within your component
  const floorSelectorStyle = {
    position: "absolute",
    zIndex: 1000,
    background: theme === "dark" ? "#212529" : "white",
    padding: "10px",
    bottom: "10px", // Adjust this value as needed
    right: "50px",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    color: theme === "dark" ? "#f8f9fa" : "black",
    transform: "translateY(0%)", // Initialize transform property
  };

  const selectStyle = {
    padding: "5px",
    borderRadius: "5px",
    background: theme === "dark" ? "#343a40" : "white", // Slightly lighter dark background for contrast
    color: theme === "dark" ? "#f8f9fa" : "black", // Bootstrap dark text
    border: getThemeStyle("1px solid #888", "1px solid #ccc"),
  };

  return (
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
        building={building} // Pass the building object as a prop
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
      {searchResults.map((result, idx) => {
        let positions;

        if (result.type === "room" && result.room && result.room.coords) {
          positions = result.room.coords.map(([lat, lng]) => [lat, lng]);
        } else if (result.coords) {
          positions = result.coords.map(([lat, lng]) => [lat, lng]);
        } else {
          console.log(
            `Skipping result (index ${idx}) due to missing or invalid coords:`,
            result
          );
          return null; // Skip rendering the Polygon if coords is missing or invalid
        }

        if (!positions || positions.length === 0) {
          console.log(
            `Skipping result (index ${idx}) due to undefined or empty positions:`,
            result
          );
          return null; // Skip rendering the Polygon if positions is undefined or empty
        }

        console.log(`Rendering result (index ${idx}):`, result);
        console.log(`Positions:`, positions);

        return (
          <Polygon
            key={idx}
            positions={positions}
            pathOptions={{
              color: "red",
              fillColor: "red",
              fillOpacity: 0.5,
              weight: 2,
            }}></Polygon>
        );
      })}
    </Pane>
  );
};

// Map Component
const MapComponent = () => {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(18);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const mapRef = useRef(null);
  const buildingData = useBuildingData();

  const { user } = useAuth();

  const handleSaveEvent = async (event) => {
    try {
      if (!user) {
        console.error("User is not logged in.");
        return;
      }

      // Make an API request to save the event to the user's events array
      await axios.post(
        `${API_BASE_URL}/api/auth/save-event`,
        {
          eventId: event._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Event saved", event.name);
    } catch (error) {
      console.log("Error saving event: ", error);
    }
  };

  const handleBuildingClick = useCallback((building) => {
    // if (selectedBuilding === building) {
    // 	return;
    // }
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
    (searchInput) => {
      let searchTerm;
      let suggestion;

      if (typeof searchInput === "string") {
        searchTerm = searchInput;
      } else if (searchInput && searchInput.name) {
        suggestion = searchInput;
        searchTerm = suggestion.name;
      } else {
        setSearchResults([]);
        setIsSearchActive(false);
        return;
      }

      if (!searchTerm) {
        setSearchResults([]);
        setIsSearchActive(false);
        return;
      }

      setIsSearchActive(true);

      // Extract the room number and building name from the search term
      const [roomNumber, ...rest] = searchTerm.split(/\s*\((.+)/);
      const buildingName = rest.length > 0 ? rest[0].slice(0, -1) : null;

      // Find the building based on the extracted building name or suggestion
      const building = buildingName
        ? buildingData.find(
            (building) =>
              building.name.toLowerCase() === buildingName.toLowerCase()
          )
        : suggestion && suggestion.building
        ? buildingData.find(
            (building) =>
              building.name.toLowerCase() === suggestion.building.toLowerCase()
          )
        : null;

      if (building) {
        if (suggestion && suggestion.type === "building") {
          handleBuildingClick(building);
        }
        if (!selectedBuilding) {
          setSelectedBuilding(building);
        }
        // Find the room based on the extracted room number and building
        const room = building.floors
          .flatMap((floor) => floor.rooms)
          .find((room) => room.name === roomNumber);

        if (room && room.coords) {
          const floorForRoom = building.floors.find((floor) =>
            floor.rooms.some((r) => r.name === room.name)
          );

          setSelectedFloor(floorForRoom.name);

          // Create a suggestion object with the room's coords
          const suggestion = {
            id: room._id,
            name: `${room.name} (${building.name})`,
            building: building.name,
            floor: floorForRoom.name,
            type: "room",
            coords: room.coords,
          };

          setSearchResults([suggestion]);
          const center = calculateCenter(room.coords);
          mapRef.current.setView(center, 22);
        } else {
          console.log(
            `Room "${roomNumber}" not found or missing coords in building "${building.name}"`
          );
          setSearchResults([]);
        }
      } else {
        console.log("No building found for the search term.");
        setSearchResults([]);
      }
    },
    [buildingData, handleBuildingClick]
  );

  useEffect(() => {
    const handleEventClick = (e) => {
      const event = e.detail;
      if (event && event.coords) {
        const [lat, lng] = event.coords;
        mapRef.current.setView([lat, lng], 22);
        setSelectedEvent(event);
      }
    };

    window.addEventListener("eventClick", handleEventClick);

    return () => {
      window.removeEventListener("eventClick", handleEventClick);
    };
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/events`);
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const handleSearchEvent = (event) => {
      const suggestion = event.detail;
      handleSearch(suggestion);
    };

    window.addEventListener("search", handleSearchEvent);

    return () => {
      window.removeEventListener("search", handleSearchEvent);
    };
  }, [handleSearch]);

  const handlePopupClose = () => {
    setSelectedEvent(null);
  };

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;

      // Define the event handler function
      const onZoomEnd = () => {
        const newZoomLevel = map.getZoom();
        setZoomLevel(newZoomLevel);
        console.log("Current zoom level:", newZoomLevel);
      };

      // Attach event listener
      map.on("zoomend", onZoomEnd);

      // Cleanup function to remove event listener
      return () => {
        map.off("zoomend", onZoomEnd);
      };
    }
  }, [mapRef]); // useEffect dependency on mapRef

  return (
    <div style={{ display: "flex", height: "99vh" }}>
      {selectedBuilding && (
        <>
          <FloorSelector
            selectedBuilding={selectedBuilding}
            selectedFloor={selectedFloor}
            onChange={handleFloorChange}
          />
          {/* <SearchBar onSearch={handleSearch} /> */}
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

        {events.map((event) => (
          <EventMarker
            key={event._id}
            marker={event}
            onSaveEvent={handleSaveEvent}
            selectedEvent={selectedEvent}
            onPopupClose={handlePopupClose}
          />
        ))}

        <BuildingPolygons
          buildingData={buildingData}
          handleBuildingClick={handleBuildingClick}
          selectedBuilding={selectedBuilding}
          selectedFloor={selectedFloor}
          zoomLevel={zoomLevel}
        />

        {/* Render search results as rectangles */}
        {isSearchActive && (
          <SearchResultsOverlay searchResults={searchResults} />
        )}

        <MouseCoordinateDisplay />
        <MapClickLogger />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
