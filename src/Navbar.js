import React, { useEffect } from 'react'
import {Navbar, Container, Row, Col, Button, Form} from 'react-bootstrap';
import SignIn from "./components/auth/SignIn"
import SignUp from "./SignUpPage"
import { useNavigate } from 'react-router-dom';

export default function MyNavbar() {
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    navigate('/SignUp')
  }

  const handleEventsClick = (e) => {

  }
  
  return(
    <div>

      <Navbar bg="light" expand="lg">
        <Container>
          {/* put navigate later below in navbar.brand tag*/}
          <Navbar.Brand>
            <img 
            src={require('./Assets/icon.jpg')} //logo placeholder
            // width="30"
            height="70"
            className="d-inline-blck align-top"
            />
          </Navbar.Brand>
          <Navbar.Brand>
            <Button variant="outline-success"><h2>Events</h2></Button>
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