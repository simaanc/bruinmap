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

import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

export default Sidebar = () => {

  return(
    <div>
      <Sidebar>
        <Menu>
          <SubMenu label="Charts">
            <MenuItem> Pie charts </MenuItem>
            <MenuItem> Line charts </MenuItem>
          </SubMenu>
          <MenuItem> Documentation </MenuItem>
          <MenuItem> Calendar </MenuItem>
        </Menu>
      </Sidebar>;
    </div>

  );
}

