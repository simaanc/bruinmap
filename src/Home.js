import React from "react";
import MapComponent from "./MapComponent"; // Ensure this path is correct
import Login from "./Login";
import SignUpPage from "./SignUpPage";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
// import Sidebar from "./Sidebar"
import MyNavbar from "./Navbar";

function Home() {
	return (
    <div>
      {/* <Sidebar /> */}
      <MyNavbar />
      {/* <LoginPopup /> */}
      <MapComponent />
    
    </div>
    
	);
}

export default Home;
