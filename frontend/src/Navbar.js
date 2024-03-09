import React, { useEffect, useContext } from 'react'
import { Navbar, Container, Row, Col, Button, Form, Dropdown } from 'react-bootstrap';
import SignIn from "./components/auth/SignIn"
import { useNavigate } from 'react-router-dom';
import { UserAuth } from './Context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';


export default function MyNavbar() {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    navigate('/SignUp')
  }

  const handleSignOut = async () => {
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

  return (
    <div>

      <nav class="navbar navbar-expand-lg navbar-light bg-body-tertiary">


        <div class="container">

          <a class="navbar-brand me-2">
            <img
              src="https://i.imgur.com/pSTs7Pe.png"
              height="64"
              alt="BruinMap Logo"
              loading="lazy"
            />
          </a>
          {/* Simple Dropdown Menu */}
          <Dropdown>
            <Dropdown.Toggle variant="primary" style={{backgroundColor: "#0a87ca", borderColor: "#024b76", borderWidth: '1.5px' }} id="dropdown-basic">
              <FontAwesomeIcon icon={faUser} /> {/* User Icon */}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item onClick={handleSignOut}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>


          <button
            data-mdb-collapse-init
            class="navbar-toggler"
            type="button"
            data-mdb-target="#navbarButtonsExample"
            aria-controls="navbarButtonsExample"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i class="fas fa-bars"></i>
          </button>


          <div class="collapse navbar-collapse" id="navbarButtonsExample">

            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link" href="#">Dashboard</a>
              </li>
            </ul>


            <nav class="navbar navbar-light bg-body-tertiary">
              <div class="container-fluid">
                <a class="navbar-brand">Search</a>
                <form class="d-flex input-group w-auto">
                  <input
                    type="search"
                    class="form-control rounded"
                    placeholder="room # or building"
                    aria-label="Search"
                    aria-describedby="search-addon"
                  />
                  <span class="input-group-text border-0" id="search-addon">
                    <i class="fas fa-search"></i>
                  </span>
                </form>
              </div>
            </nav>



            <a
              data-mdb-ripple-init
              class="btn btn-dark px-3"
              href="https://github.com/simaanc/bruinmap"
              role="button"
              style={{ padding: '10px 20px', fontSize: '16px' }} // Adjust padding and font size as needed
            >
              <i class="fab fa-github"></i>
            </a>


          </div>

        </div>

      </nav>

    </div>
  );
}