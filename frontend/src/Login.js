import React, {component, useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {Container, Row, Col, Button, Form} from 'react-bootstrap';
import { useState } from 'react';
import { auth } from './firebase.config';
import { useNavigate } from 'react-router-dom';
// import UserViewManager from './UserViewManager';
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'

export default function Login() {
  // const [isShownUser, setIsShownUser] = useState(false);

  return (
    <div>
      <SignIn />
    
    </div>
   
    // <Container>
    //   <UserLogIn/>
    // </Container>
  );
}
// function UserLogIn() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const user = new UserViewManager();

//   var id = null;

//   useEffect(() => {
//     if(id==null && user.getID()!=null) {
//       id=user.getID();
//     }
//   })

//   const handleClick = () => {
//     user.signIn(email, password);
//     if(id!=null) {
//       navigate(`/UserPage/${id}`);
//     }
//   }


// return (
//   <div>
//   <Form>
//     <Form.Group>
//       <Form.Label>User Email</Form.Label>
//       <Form.Control onChange={(event)=> setEmail(event.target.value)} type="email"></Form.Control>

//     </Form.Group>
//       <Form.Group controlId="formPassword">
//         <Form.Label>Password</Form.Label>
//          {/* onChange={(event) => setPassword(event.target.value)}  */}
//         <Form.Control onChange={(event) => setPassword(event.target.value)} type="password" placeholder="User Password" />
//       </Form.Group>
//       <Button variant="flat" size="medium" onClick={handleClick}>Login</Button>
//   </Form>
//   </div>
// );
// }
