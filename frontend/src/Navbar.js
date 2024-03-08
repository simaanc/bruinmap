import React, { useEffect, useContext } from 'react'
import {Navbar, Container, Row, Col, Button, Form} from 'react-bootstrap';
import SignIn from "./components/auth/SignIn"
import { useNavigate } from 'react-router-dom';
import { UserAuth } from './Context/AuthContext';

export default function MyNavbar() {
  const { user, logout} = UserAuth();
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    navigate('/SignUp')
  }

  const  handleSignOut = async () =>  {
    try {
      await logout();
      navigate('/Home')
      console.log('You are logged out')
    } catch (error) {
      console.log(error);
    }
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
          {/* <Navbar.Brand>
            <Container>
              <SignIn />
            </Container>
          </Navbar.Brand> */}
          {/* <Navbar.Brand>
            <Button onClick={handleSignUp}>Sign Up</Button>
          </Navbar.Brand> */}
          <Navbar.Brand>
            <Button onClick={handleSignOut}>Sign Out</Button>
          </Navbar.Brand>
        </Container>
      </Navbar>
    </div>
  );
}