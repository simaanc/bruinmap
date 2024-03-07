import React from "react";
import MapComponent from "./MapComponent"; // Ensure this path is correct
import Login from "./Login";
import SignUpPage from "./SignUpPage";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
// import Sidebar from "./Sidebar"
import LoginPopup from "./LoginPopup";
import MyNavbar from "./Navbar";
import Home from "./Home";

function App() {
	return (
 
    <Router>
      
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/Login" element={<Login />} /> */}
        <Route path="/SignUp" element={<SignUpPage />} />
        {/* <Route path="/MapComponent" element={<MapComponent />} /> */}
      </Routes>
    </Router>

    
	);
}

export default App;
