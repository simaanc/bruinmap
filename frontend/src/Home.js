import React from "react";
import MapComponent from "./components/MapComponent";
import Navbar from "./components/Navbar";
import { useAuth } from "./Context/AuthContext";
import "./App.css";

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