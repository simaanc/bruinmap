import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import 'leaflet-fullscreen/dist/Leaflet.fullscreen';
import L from 'leaflet';
import '@react-leaflet/core';

// Map style
const mapStyle = { height: '90vh', width: '100%' };

// Styling for the polygons
const footprintStyle = {
    color: 'black',
    fillColor: 'white',
    fillOpacity: 1,
};

// Coordinates for the floor plans
const L1Coordinates = [
    [0, 0], [50.5, 0], [50.5, 17], [31.5, 17], [31.5, 19], [12, 19], [12, 17], [8, 17], [4, 17], [4, 13], [0, 13]
];

const L2Coordinates = [
    [0, 0], [52, 0], [52, 17], [31, 17], [31, 19], [12, 19], [12, 17], [8, 17], [3, 17], [3, 13], [0, 13]
];

const MapWithSidebar = () => {
    const [sidebarVisible, setSidebarVisible] = useState(false);

    // Function to convert coordinates to Leaflet's format
    const convertCoordinates = (coordinates) => coordinates.map(coord => L.latLng(coord[0], coord[1]));

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {sidebarVisible && (
                <div style={{ width: '250px', background: '#f0f0f0' }}>
                    <p>Sidebar Content Here</p>
                    <button onClick={() => setSidebarVisible(false)}>Close Sidebar</button>
                </div>
            )}
            <div style={{ flex: 1 }}>
                <MapContainer center={[25.25, 9.5]} zoom={3} style={mapStyle} crs={L.CRS.Simple}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {/* Add polygons for floor plans */}
                    <Polygon pathOptions={footprintStyle} positions={convertCoordinates(L1Coordinates)} />
                    <Polygon pathOptions={footprintStyle} positions={convertCoordinates(L2Coordinates)} />
                </MapContainer>
                <button onClick={() => setSidebarVisible(true)}>Open Sidebar</button>
            </div>
        </div>
    );
};

export default MapWithSidebar;