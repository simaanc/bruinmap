import React from 'react'
import { useState } from 'react';
// import {auth} from '../../firebase.config';
// import {signInWithEmailAndPassword} from "firebase/auth"
import {useNavigate} from "react-router-dom";
import {Container, Row, Col, Button, Form} from 'react-bootstrap';
import {UserAuth} from '../../Context/AuthContext';

const SignIn = ()  => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = UserAuth();


  // const handleSignIn = (e) => {
  //   e.preventDefault();
  //   signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
  //     // console.log(userCredential)
  //     // const uid = userCredential.uid;
  //     // navigate('/MapComponent')
  //   }).catch((error) => {
  //     console.log(error)
  //   });
  // };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('')
    try {
      await signIn(email, password)
      navigate('/')
    } catch (e) {
      setError(e.message)
      console.log(e.message)
    }
  }

 

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
          <Button size="medium" onClick={handleSignIn}>Login</Button>
          </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
}

export default SignIn;