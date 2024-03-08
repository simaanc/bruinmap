import React from 'react';
import  { Navigate } from "react-router-dom"
// import { useContext } from "react"
// import { Context } from "../../Context/AuthContext"
import {useAuth} from '../../context/AuthContext';

// export function Protected({children}) {
//   const {user} = useContext(Context);
//   const navigate = useNavigate();

//   if(!user) {
//     return navigate('/Home');
//   } else {
//     return children
//   }
// }


const ProtectedRoute = ({children}) => {
  const {user} = useAuth();
  if(!user) {
    console.log("Redirecting to /Home due to lack of authentication.");
    return <Navigate to='/Home' />;
  }
  return children;
};

export default ProtectedRoute;