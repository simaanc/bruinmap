import React from 'react';
import  { Navigate } from "react-router-dom"
// import { useContext } from "react"
// import { Context } from "../../Context/AuthContext"
import {UserAuth} from '../../Context/AuthContext';

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
  const {user} = UserAuth();
  // const navigate = useNavigate();
  if(!user) {
    // return navigate('/Home')
    return <Navigate to='/Home' />
  }
  return children;
};

export default ProtectedRoute;