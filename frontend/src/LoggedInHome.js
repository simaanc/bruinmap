// protected map screen, can access user data etc. 
import React from "react";
import MapComponent from "./MapComponent"; // Ensure this path is correct
import Login from "./Login";
import SignUpPage from "./SignUpPage";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
// import Sidebar from "./Sidebar"
import MyNavbar from "./Navbar";

function LoggedInHome() {
	return (
    <div>
      {/* <Sidebar /> */}
      <MyNavbar bg="dark" />
      <h1>LOGGED IN</h1>
      {/* <LoginPopup /> */}
      <MapComponent />
    
    </div>
    
	);
}

export default LoggedInHome;
