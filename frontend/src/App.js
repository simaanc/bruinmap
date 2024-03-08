import React from "react";
// import MapComponent from "./MapComponent"; // Ensure this path is correct
// import Login from "./Login";
import SignUpPage from "./SignUpPage";
// import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import { Route, Routes } from "react-router-dom";
// import MyNavbar from "./Navbar";
import Home from "./Home";
// import PrivateRoutes from "./PrivateRoutes";
import LoggedInHome from "./LoggedInHome";
import { AuthContextProvider } from "./Context/AuthContext";
import ProtectedRoute from './components/auth/ProtectedRoute';
function App() {
	return (
    <div>
      <AuthContextProvider>
        {/* <Router> */}
          <Routes>
            <Route path="/Home" element={<Home />} />
            {/* <Route path="/Login" element={<Login />} /> */}
            <Route path="/SignUp" element={<SignUpPage />} />
            {/* <Route path="/MapComponent" element={<MapComponent />} /> */}
            {/* <Route element={<PrivateRoutes />}> */}
            {/* <Protected>
              <Route element={<LoggedInHome/>} path="/" exact/>
            </Protected> */}
            <Route path='/' element={<ProtectedRoute><LoggedInHome /></ProtectedRoute>} />
          </Routes>
        {/* </Router> */}
      </AuthContextProvider>
    </div>
    
	);
}

export default App;
