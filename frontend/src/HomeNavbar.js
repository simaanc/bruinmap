import React, { useEffect, useContext } from 'react'
import {Navbar, Container, Row, Col, Button, Form} from 'react-bootstrap';
import SignIn from "./components/auth/SignIn"
import { useNavigate } from 'react-router-dom';
import { UserAuth } from './Context/AuthContext';

export default function HomeNavbar() {
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    navigate('/SignUp')
  }

  return(
    <div>

      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>
            <img 
            src={require('./Assets/icon.jpg')} //logo placeholder
            // width="30"
            height="70"
            className="d-inline-blck align-top"
            />
          </Navbar.Brand>
          <Navbar.Brand>
            <Container>
              <SignIn />
            </Container>
          </Navbar.Brand>
          <Navbar.Brand>
            <Button onClick={handleSignUp}>Sign Up</Button>
          </Navbar.Brand>
        </Container>
      </Navbar>
    </div>
  );
}