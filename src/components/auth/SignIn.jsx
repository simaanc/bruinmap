import React from 'react'
import { useState } from 'react';
import {auth} from '../../firebase.config';
import {signInWithEmailAndPassword} from "firebase/auth"
import {useNavigate} from "react-router-dom";
import {Container, Row, Col, Button, Form} from 'react-bootstrap';

const SignIn = ()  => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      console.log(userCredential)
      const uid = userCredential.uid;
      // navigate('/MapComponent')
    }).catch((error) => {
      console.log(error)
    });
  };

  // const handleSignUp = (e) => {
  //   navigate('/SignUp')
  // }

  return (
    <div className='sign-in-container'>
      <Container>
        
        <Form>

          {/* <Form.Group> */}
          <Row>
            <Col>
            <Form.Label>User Email</Form.Label>
            <Form.Control onChange={(event)=> setEmail(event.target.value)} type="email"></Form.Control>
            </Col>
          {/* </Form.Group> */}
          {/* <Form.Group controlId="formPassword"> */}
          <Col>
            <Form.Label>Password</Form.Label>
            <Form.Control onChange={(event) => setPassword(event.target.value)} type="password"></Form.Control>
          {/* </Form.Group> */}
          </Col>
          <Col>
          <Button size="medium" onClick={signIn}>Login</Button>
          </Col>
          </Row>
        </Form>
        
        {/* <Button onClick={handleSignUp}>
          Sign Up
        </Button> */}

      {/* <form onSubmit={signIn}>
        <h1>Log In</h1>
        <input type="email" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
        <input type="password" placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
        <button type="submit">Log In</button>
      </form> */}
      </Container>
    </div>
  );
}

export default SignIn;