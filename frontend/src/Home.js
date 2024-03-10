import React, { useState } from "react";
import MapComponent from "./components/MapComponent";
import Navbar from "./components/Navbar";
import { useAuth} from "./Context/AuthContext"; // Adjust the import path as necessary
import './App.css'; // Make sure this path is correct

function Home() {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <Navbar />
      {/* {user && <h1>LOGGED IN</h1>} Optionally include other UI elements here */}
      <div className="map-container">
        <MapComponent />
      </div>
    </div>
  );
}

export default Home;