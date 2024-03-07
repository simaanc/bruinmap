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
  
      <SignUp />
    </div>
  );
}